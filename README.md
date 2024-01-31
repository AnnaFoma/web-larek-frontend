# Проектная работа "Веб-ларек"

Ссылка на репозиторий: git@github.com:AnnaFoma/web-larek-frontend.git


Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/styles/styles.scss — корневой файл стилей
- src/utils/constants.ts — файл с константами
- src/utils/utils.ts — файл с утилитами

## Установка и запуск
Для установки и запуска проекта необходимо выполнить команды

```
npm install
npm run start
```

или

```
yarn
yarn start
```
## Сборка

```
npm run build
```

или

```
yarn build
```

# Архитектура 

## Базовый слой

### 1.	Класс EventEmitter
Сам класс хранит информацию о всех слушателях, которые в него добавляются.

Методы класса:
    on() - для добавления события.
    off() - для снятия события.
    emit() – инициировать событие с данными. 

Pеализованы методы  onAll и  offAll  — для подписки на все события и сброса всех подписчиков. 
Метод  trigger , генерирующий заданное событие с заданными аргументами. Это позволяет передавать его в качестве обработчика события в другие классы.

```
type EventName = string | RegExp;
type Subscriber = Function;
type EmitterEvent = {
    eventName: string,
    data: unknown
};
```

```
interface IEvents {
    on<T extends object>(event: EventName, callback: (data: T) => void): void;
    emit<T extends object>(event: string, data?: T): void;
    trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
}
```

### 2.	Класс Api
Данный класс содержит базовый url и опции, которые необходимо добавить в запрос.
Имеет два метода: get и post – для получения данных и отправки данных.

### 3.	Класс Component
Данный класс является абстрактным и необходим для создания компонентов интерфейса пользователя.

Методы класса:

toggleClass - переключить класс.
setText - установить текстовое содержимое.
setImage - установить изображение с алтернативным текстом
setDisabled - сменить статус блокировки.
setHidden - скрыть элемент
setVisible - показать элемент.
render - вернуть корневой DOM-элемент


## Компоненты модели данных

### 1.	Класс Product
Позволяет работать с товарами, запрашивает их с сервера и хранит данные о них.

```
export interface IProduct {
  id: string;
  category: string;
  image: string;
  title: string;
  price: number | null;
  description: string;
}
```

## Компоненты представления

### 1.	Класс Page
Класс отображает все элементы на странице: каталог товаров, счетчик товаров в корзине, не позволяет скроллить страницу.

Методы класс:
    set counter - установить значение счетчика.
    set catalog - заменить содержимое каталога.
    set locked - блокировка скроллинга страницы при неоходимости (и наоборот).


### 2.	Класс Form
Класс для создания и управления формами. Здесь происходит обработка событий ввода/ отправки, отображение формы, проверка валидности формы.

Методы класса:
    onInputChange() - обработчик событий ввода;
    set valid() - возможность отправки формы при ее валидности;
    set errors() - отображает ошибки валидации формы.

```
interface IFormState {
    valid: boolean;
    errors: string[];
}
```

### 3.	Класс Modal
Данный класс реализует интерфейс модального окно. Возможности: открывать модальное окно, закрывть модальное окно, слушать события.

```
interface IModalData {
    content: HTMLElement;
}
```
```
export interface Modal {
	closeButton: HTMLButtonElement;
    сontent: HTMLElement;

	constructor(container: HTMLElement, events: IEvents);

	openModal(): void;
	closeModal(): void;
}
```

### 4.	Класс Basket
Реализует интерфейс модального окна корзины выбранных товаров. Дает возможность добавлять/ удалять товары в корзине.

```
interface IBasketView {
    items: HTMLElement[];
    total: number;
    selected: string[];
}
```

### 5.	Класс Card
Данный класс реализует интерфейс карточки товара.

Методы класса:
    set/get id - установить/получить индификатор карточки.
    set/get title - установить/получить название товара.
    set/get price - установить/получить цену товара.
    set/get category - установить/получить категорию товара.
    set image - установить/получить изображение товара.
    set description - установить/получить описание товара.

```
interface ICard<T> {
    title: string;
    description?: string | string[];
    image: string;
    status: T;
}
```

### 6.	Класс OrderForm
Реализует интерфейс карточки заказа (форма). В нем отображаются способ оплаты и адрес доставки.

Методы класса:
    toggleButton - переключает кнопки выбора способа оплаты.
    set address - устанавливает адрес доставки.

### 7.	Класс PersonalForm
Реализует интерфейс для работы с модальным окном с персональными данными (форма): email и номер телефона покупателя.

Методы класса:
    set phone - устанавить номер телефона.
    set email - устанавить адрес электронной почты.

### 8.	Класс Success
Реализует интерфейс для работы с модальным окном при успешном оформлении заказа.

В конструктор класса передается действие: 
    onClick: () => void;

Метод класса: 
    set totalsum - устанавливает итоговую сумму покупки.

```
interface ISuccess {
    total: number;
}
```