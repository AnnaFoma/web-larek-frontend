# Проектная работа "Веб-ларек"

Ссылка на макет: https://www.figma.com/file/50YEgxY8IYDYj7UQu7yChb/%D0%92%D0%B5%D0%B1-%D0%BB%D0%B0%D1%80%D1%91%D0%BA?type=design&node-id=1-2&mode=design&t=i39peglqxA8FL9tA-0


Стек: HTML, SCSS, TS, Webpack

Структура проекта:
- src/ — исходные файлы проекта
- src/components/ — папка с JS компонентами
- src/components/base/ — папка с базовым кодом

Важные файлы:
- src/pages/index.html — HTML-файл главной страницы
- src/types/index.ts — файл с типами
- src/index.ts — точка входа приложения
- src/scss/styles.scss — корневой файл стилей
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

### 1.	class EventEmitter implements IEvents
Сам класс хранит информацию о всех слушателях, которые в него добавляются.

Свойства:  
    ```
    _events: Map<EventName, Set<Subscriber>>; — список событий
    ```  

`constructor()` - инициализация объекта.  

Методы класса:  
    `on<T extends object>(eventName: EventName, callback: (event: T) => void)` - Установить обработчик на событие.  
    `off(eventName: EventName, callback: Subscriber)` - Снять обработчик с события.  
    `emit<T extends object>(eventName: string, data?: T)` – Инициировать событие с данными.  
    `onAll(callback: (event: EmitterEvent) => void)` - Слушать все события.  
    `offAll()` - Сбросить все обработчики.  
    `trigger<T extends object>(eventName: string, context?: Partial<T>)` - Сделать коллбек триггер, генерирующий событие при вызове.  


### 2.	class Api
Данный класс содержит базовый url и опции, которые необходимо добавить в запрос.  

Свойства:  
    ```
    readonly baseUrl: string; - базовый url для запросов  
	protected options: RequestInit; - опции запроса  
    ```

`constructor(baseUrl: string, options: RequestInit = {})` - принимает базовый URL и опции запросов.  

Методы класса:  
    `get(uri: string)` - для получения данных.  
    `post(uri: string, data: object, method: ApiPostMethods = 'POST')` - для отправки данных.  


### 3. abstract class Component<T>
Данный класс является абстрактным и необходим для создания компонентов интерфейса пользователя.  

`protected constructor(protected readonly container: HTMLElement)` - принимает элемент контейнера для компонента.  

Методы класса:  
    `toggleClass(element: HTMLElement, className: string, force?: boolean)` - переключить класс.  
    `protected setText(element: HTMLElement, value: unknown)` - установить текстовое содержимое.  
    `protected setImage(element: HTMLImageElement, src: string, alt?: string)` - установить изображение с алтернативным текстом.  
    `setDisabled(element: HTMLElement, state: boolean)` - сменить статус блокировки.  
    `protected setHidden(element: HTMLElement)` - скрыть элемент.  
    `protected setVisible(element: HTMLElement)` - показать элемент.  
    `render(data?: Partial<T>)` - вернуть корневой DOM-элемент.  


### 4. abstract class Model<T>
Данный класс является абстрактным и необходим для создания структуры модели данных.  

`constructor(data: Partial<T>, protected events: IEvents)` -  принимает данные для модели, объект событий, уведомляющий об изменениях в модели.  

Метод класса:  
    `emitChanges(event: string, payload?: object)` - сообщить всем, что модель поменялась.  

## Компоненты модели данных

### 1.	class Product extends Model<IProduct>
Класс для создания и упрвления данными продукта. Предоставляет информацию о продукте.  


### 2.	class AppState extends Model<IAppState> 
Представляет состояние приложения, в том числе данные каталога, корзины, предпросмотра, заказа, ошибок формы.   

Конструктор наследуется из класса Model.  
`constructor(data: Partial<T>, protected events: IEvents)`  

Методы класса:  
    `clearOrder()` - очистить данные заказа.  
    `clearBasket()` - очистить данные корзины.  
    `setCatalog(items: IProduct[])` - устанавить каталог продуктов, каждый элемент преобразовать в экземпляр Product.  
    `setPreview(item: Product)` - устанавить предпросомотр продукта.  
    `addToBasket(item: Product)` - добавить товар в корзину.  
    `removeFromBasket(item: Product)` - удалить товар из корзины.  
    `updateBasket()` -  обновить данные корзины.  
    `setDeliveryField(field: keyof IDeliveryForm, value: string)` - устанавливает значени в данные доставки заказа.  
    `setPersonalField(field: keyof IPersonalForm, value: string)` - устанавливает значени в данные личных данных заказа.  
    `validateDelivery()` - проверяет валидность формы доставки.  
    `validatePersonal()` - проверяет валидность формы личных данных.  


## Общие компоненты представления

### 1.	class Form<T> extends Component<IFormState> 
Класс для создания и управления формами. Здесь происходит обработка событий ввода/ отправки, отображение формы, проверка валидности формы.  

Свойства:  
    ```
    protected _submit: HTMLButtonElement; - кнопка отправки формы  
	protected _errors: HTMLElement; - ошибки валидации формы  
    ```

`constructor(protected container: HTMLFormElement, protected events: IEvents)` - принимает контейнер формы и объект, управляющий событиями.  

Методы класса:  
    `protected onInputChange(field: keyof T, value: string)` - обработчик событий ввода.  
    `set valid(value: boolean)` - возможность отправки формы при ее валидности.  
    `set errors(value: string)` - отображает ошибки валидации формы.  
    `render(state: Partial<T> & IFormState)` - рендеринг, устанвливая валидность формы, ошибки и значения полей.  


### 2.	class Modal extends Component<IModalData>
Данный класс реализует интерфейс модального окно. Возможности: открывать модальное окно, закрывть модальное окно, слушать события.  

Свойства:  
    ```
    protected _closeButton: HTMLButtonElement; - кнопка чтобы закрыть модальное окно  
	protected _content: HTMLElement; - содержимое в модальном окне  
    ```

`constructor(container: HTMLElement, events: IEvents)` - принимает контейнер для модального окна и объект, управляющий событиями.  

Методы класса:  
    `set content(value: HTMLElement)` - устанавливает содержимое модального окна.
    `open()` - открыть модальное окно.  
    `close()` - закрыть модальное окно.  
    `render(data: IModalData)` - рендерит модалку с содержимым, переданным в нее, и открывает его.


### 3.	class Basket extends Component<IBasketView>
Реализует интерфейс модального окна корзины выбранных товаров. Дает возможность добавлять/ удалять товары в корзине.  

Свойства:  
    ```
    protected _list: HTMLElement; - список всех товаров в корзине  
	protected _total: HTMLElement; - итоговая цена товаров в корзине  
	protected _button: HTMLElement; - кнопка чтобы оформить заказ  
    ```

`constructor(container: HTMLElement, protected events: EventEmitter)` - принимает контейнер и объект, управляющий событиями.  

Методы класса:  
    `set items(items: HTMLElement[])` - отобразить все товары в корзине (или их отсутвие - "корзина пуста").  
    `set totalSum(total: number)` - установить общую стоимость всех товаров в корзине.  


### 4.	class Success extends Component<ISuccess>
Реализует интерфейс для работы с модальным окном при успешном оформлении заказа.  

Свойства:  
    ```
    protected _close: HTMLElement; - кнопка чтобы закрыть модальное окно усешного оформления заказа  
	protected _total: HTMLElement; - итоговая (общая) стоимость заказа  
    ```

`constructor(container: HTMLElement, actions: ISuccessActions)` - принимает контейнер и объект для управления событиями.  

В конструктор класса передается действие: `onClick: () => void`.  

Метод класса:  
    `set totalSum(value: string)` - устанавливает итоговую сумму покупки.  


## Компоненты представления

### 1.	class Page extends Component<IPage>
Класс отображает все элементы на странице: каталог товаров, счетчик товаров в корзине, не позволяет скроллить страницу.  

Свойства:  
    ```
    protected _counter: HTMLElement; - значение счетчика на корзине  
	protected _catalog: HTMLElement; - список карточек каталога  
	protected _wrapper: HTMLElement; - главный контейнер страницы  
	protected _basket: HTMLElement; - кнопка, для перехода в корзину  
    ```

`constructor(container: HTMLElement, protected events: IEvents)` - принимает контейнер страницы и объект, управляющий событиями.  

Методы класса:  
    `set counter(value: number)` - установить значение счетчика.  
    `set catalog(items: HTMLElement[])` - заменить содержимое каталога.  
    `set locked(value: boolean)` - блокировка скроллинга страницы при неоходимости (и наоборот).  


### 2.	class Card extends Component<ICard>
Данный класс реализует интерфейс карточки товара. Предназначен для отображения и взаимодействия с карточками товара.  

Свойства:  
    ```
    protected _title: HTMLElement; - заголовок карточки товара  
	protected _price: HTMLElement; - цена товара  
	protected _image?: HTMLImageElement; - изображение товара  
	protected _description?: HTMLElement; - описание товара  
	protected _button?: HTMLButtonElement; - кнопка чтобы положить товар в корзину или удалить его  
	protected _category?: HTMLElement; - категория товара  
	protected _index?: HTMLElement; - индекс товара в корзине  
	protected _buttonText: string; - текст, отображаемый в кнопке  
    ```

`constructor(container: HTMLElement, actions?: ICardActions)` - принимает контейнер карточки и действия, связанные с карточкой.  

Методы класса:  
    `set id(value: string) / get id()` - установить/получить индификатор карточки.  
    `set title(value: string) / get title()` - установить/получить название товара.  
    `set price(value: number | null) / get price()` - установить/получить цену товара.  
    `set category(value: string) / get category()` - установить/получить категорию товара.  
    `set index(value: string) / get index()` - установить/получить индекс товара.  
    `set image(value: string)` - установить/получить изображение товара.  
    `set description(value: string)` - установить/получить описание товара.  
    `set buttonText(value: string)` - устанавливает текст кнопки.  


### 3.	class DeliveryForm extends Component<IDeliveryForm>
Реализует интерфейс для взаимодействия с формой доставки. Возможно выбрать способ оплаты и ввести адрес доставки.  

Свойства:  
    ```
    protected _cardButton: HTMLButtonElement; - кнопки оплаты "онлайн"  
	protected _cashButton: HTMLButtonElement; - кнопка оплаты "при получении"  
    ```

`constructor(container: HTMLFormElement, events: IEvents, actions?: ICardActions)` -  принимает контейнер формы доставки, объект, управляющий событиями, и действия обработки нажатия кнопки в форме.  

Методы класса:  
   ` toggleButton(target: HTMLElement)` - переключает кнопки выбора способа оплаты.  
    `set address(value: string)` - устанавливает адрес доставки.  


### 4.	class PersonalForm extends Component<IPersonalForm>
Реализует интерфейс для работы с формой с персональными данными. Вохможен ввод email и номера телефона покупателя.  

`constructor(container: HTMLFormElement, events: IEvents)` - принимает контейнер формы личных данных и объект, управляющий событиями.  

Методы класса:  
    `set phone(value: string)` - устанавить номер телефона.  
    `set email(value: string)` - устанавить адрес электронной почты.  


### 5.	class WebLarekAPI extends Api implements IWebLarekAPI
Класс, который расширяет базовый класс Api. В нём описывыаются методы, которые понядобятся, чтобы сделать запросы к серверу.  

Свойства:  
    ```
    readonly cdn: string; - cdn url  
    ```

`constructor(cdn: string, baseUrl: string, options?: RequestInit)` - принимает cdn url, базовый url для запроса и опции запроса.  

Методы класса:  
    `getProductList()` - получить список товаров.  
    `getProductItem(id: string)` - получить товар.  
    `orderProducts(order: IOrder)` - ззаказать товар.  