import './scss/styles.scss';

import { WebLarekAPI } from './components/WebLarekAPI';
import { API_URL, CDN_URL } from './utils/constants';
import { EventEmitter } from './components/base/events';
import { AppState, Product } from './components/AppState';
import { Page } from './components/Page';
import { cloneTemplate, ensureElement } from './utils/utils';
import { Modal } from './components/common/Modal';
import {
	IPersonalForm,
	IDeliveryForm,
	IOrder,
	CatalogChangeEvent,
} from './types';
import { Card } from './components/Card';
import { Basket } from './components/common/Basket';
import { DeliveryForm } from './components/DeliveryForm';
import { PersonalForm } from './components/PersonalForm';
import { Success } from './components/common/Success';

const events = new EventEmitter();
const api = new WebLarekAPI(CDN_URL, API_URL);

const KindOfPayment: Record<string, string> = {
	card: 'card',
	cash: 'cash',
};


const cardCatalogTemplate = ensureElement<HTMLTemplateElement>('#card-catalog');
const cardPreviewTemplate = ensureElement<HTMLTemplateElement>('#card-preview');
const cardBasketTemplate = ensureElement<HTMLTemplateElement>('#card-basket');
const basketTemplate = ensureElement<HTMLTemplateElement>('#basket');
const deliveryTemplate = ensureElement<HTMLTemplateElement>('#order');
const personalTemplate = ensureElement<HTMLTemplateElement>('#contacts');
const successTemplate = ensureElement<HTMLTemplateElement>('#success');

const appData = new AppState({}, events);
const page = new Page(document.body, events);
const modal = new Modal(ensureElement<HTMLElement>('#modal-container'), events);
const basket = new Basket(cloneTemplate(basketTemplate), events);
const delivery = new DeliveryForm(cloneTemplate(deliveryTemplate), events, {
	onClick: (evt: Event) => events.emit('payment:toggle', evt.target),
});
const personal = new PersonalForm(cloneTemplate(personalTemplate), events);

// Получение списка продуктов при окрытие страницы
api
	.getProductList()
	.then(appData.setCatalog.bind(appData))
	.catch((error) => {
		console.error('Произошла ошибка:', error);
	});

// Изменились элементы каталога
events.on<CatalogChangeEvent>('items:changed', () => {
	page.catalog = appData.catalog.map((item) =>
		new Card(cloneTemplate(cardCatalogTemplate), {
			onClick: () => events.emit('card:select', item),
		}).render(item)
	);
});

// Открыть карточку товара
events.on('card:select', (item: Product) => {
	appData.setPreview(item);
});

//Предпросмотр карточки, взаимодействие с кнопкой добавить/удалить в корзину
events.on('preview:changed', (item: Product) => {
	const card = new Card(cloneTemplate(cardPreviewTemplate), {
		onClick: () => {
			events.emit('product:toggle', item);
			card.buttonText =
				appData.basket.indexOf(item) < 0 ? 'В корзину' : 'Удалить из корзины';
		},
	});
	modal.render({
		content: card.render({
			title: item.title,
			description: item.description,
			image: item.image,
			price: item.price,
			category: item.category,
			buttonText:
				appData.basket.indexOf(item) < 0 ? 'В корзину' : 'Удалить из корзины',
		}),
	});
});

// Переключение/добавление/удаление товара и обновление счетчика
events.on('product:toggle', (item: Product) => {
	if (appData.basket.indexOf(item) < 0) {
		events.emit('product:add', item);
	} else {
		events.emit('product:delete', item);
	}
});

events.on('product:add', (item: Product) => {
	appData.addToBasket(item);
});

events.on('product:delete', (item: Product) => {
	appData.removeFromBasket(item);
});

// Модальное окно открыто, прокрутка заблокирована
events.on('modal:open', () => {
	page.locked = true;
});

// Модальное окно закрыто, прокрутка заблокирована
events.on('modal:close', () => {
	page.locked = false;
});

//Счетчик корзины
events.on('counter:changed', (item: string[]) => {
	page.counter = appData.basket.length;
  })

// Открыть корзину
events.on('basket:open', () => {
	modal.render({
		content: basket.render({}),
	});
});

//Взаимодействие с корзиной, отображение товаров в ней
events.on('basket:changed', (items: Product[]) => {
	basket.items = items.map((item, index) => {
		const card = new Card(cloneTemplate(cardBasketTemplate), {
			onClick: () => {
				events.emit('product:delete', item);
			},
		});
		return card.render({
			index: (index + 1).toString(),
			title: item.title,
			price: item.price,
		});
	});
	const sum = items.reduce((total, item) => total + item.price, 0);
	basket.totalSum = sum;
	appData.order.total = sum;
});

//Открыть форму доставки
events.on('order:open', () => {
	modal.render({
		content: delivery.render({
			payment: '',
			address: '',
			valid: false,
			errors: [],
		}),
	});
	appData.order.items = appData.basket.map((item) => item.id);
});

// Смена способа оплаты заказа
events.on('payment:toggle', (target: HTMLElement) => {
	if (!target.classList.contains('button_alt-active')) {
		delivery.toggleButtons(target);
		appData.order.payment = KindOfPayment[target.getAttribute('name')];
	}
});

// Изменение полей доставки
events.on(
	/^order\..*:change/,
	(data: { field: keyof IDeliveryForm; value: string }) => {
		appData.setDeliveryField(data.field, data.value);
	}
);

// Перейти к форме личных данных по кнопке
events.on('order:submit', () => {
	modal.render({
		content: personal.render({
			email: '',
			phone: '',
			valid: false,
			errors: [],
		}),
	});
});

// Изменение полей в форме личных данных
events.on(
	/^contacts\..*:change/,
	(data: { field: keyof IPersonalForm; value: string }) => {
		appData.setPersonalField(data.field, data.value);
	}
);

// Изменение состояния валидации форм
events.on('formErrors:change', (errors: Partial<IOrder>) => {
	const { payment, address, email, phone } = errors;
	delivery.valid = !payment && !address;
	delivery.errors = Object.values({ payment, address })
		.filter((i) => !!i)
		.join('; ');
	personal.valid = !email && !phone;
	personal.errors = Object.values({ phone, email })
		.filter((i) => !!i)
		.join('; ');
});

// Оформление заказа, после нажатия на кнопку в форме личных данных
events.on('contacts:submit', () => {
	api
		.orderProducts(appData.order)
		.then((result) => {
			appData.clearBasket();
      		appData.clearOrder();
			const success = new Success(cloneTemplate(successTemplate), {
				onClick: () => {
					modal.close();
				},
			});
			success.totalSum = result.total.toString();

			modal.render({
				content: success.render({}),
			});
		})
		.catch((err) => {
			console.error(err);
		});
});
