import { Model } from './base/Model';
import {
	IProduct,
	IOrder,
	IDeliveryForm,
	IAppState,
	FormErrors,
	IPersonalForm,
} from '../types';

export class Product extends Model<IProduct> {
	id: string;
	category: string;
	image: string;
	title: string;
	price: number | null;
	description: string;
}

export class AppState extends Model<IAppState> {
	basket: Product[] = [];
	catalog: Product[];
	order: IOrder = {
		email: '',
		phone: '',
		payment: 'cash',
		address: '',
		items: [],
		total: 0,
	};
	preview: string | null;
	formErrors: FormErrors = {};

	clearOrder() {
		this.order = {
			email: '',
			phone: '',
			payment: 'cash',
			address: '',
			items: [],
			total: 0,
		};
	}

	updateBasket() {
		this.emitChanges('counter:changed', this.basket);
		this.emitChanges('basket:changed', this.basket);
	}

	clearBasket() {
		this.basket = [];
		this.updateBasket();
	}

	setCatalog(items: IProduct[]) {
		this.catalog = items.map((item) => new Product(item, this.events));
		this.emitChanges('items:changed', { catalog: this.catalog });
	}

	setPreview(item: Product) {
		this.preview = item.id;
		this.emitChanges('preview:changed', item);
	}

	addToBasket(item: Product) {
		if (this.basket.indexOf(item) <= 0) {
			this.basket.push(item);
			this.updateBasket();
		}
	}

	removeFromBasket(item: Product) {
		this.basket = this.basket.filter((element) => element != item);
		this.updateBasket();
	}

	setDeliveryField(field: keyof IDeliveryForm, value: string) {
		this.order[field] = value;
		if (this.validateDelivery()) {
			this.events.emit('order:ready', this.order);
		}
	}

	setPersonalField(field: keyof IPersonalForm, value: string) {
		this.order[field] = value;
		if (this.validatePersonal()) {
			this.events.emit('contacts:ready', this.order);
		}
	}

	validateDelivery() {
		const errors: typeof this.formErrors = {};
		if (!this.order.address) {
			errors.address = 'Укажите адрес';
		}
		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}

	validatePersonal() {
		const errors: typeof this.formErrors = {};
		if (!this.order.email) {
			errors.email = 'Укажите email';
		}
		if (!this.order.phone) {
			errors.phone = 'Укажите номер телефона';
		}
		this.formErrors = errors;
		this.events.emit('formErrors:change', this.formErrors);
		return Object.keys(errors).length === 0;
	}
}
