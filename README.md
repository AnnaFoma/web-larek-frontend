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

Свойства:  
    ```
    _events: Map — список событий.
    ```  

Констрктор: `this._events = new Map()`.

Методы класса:  
    `on()` - для добавления события.  
    `off()` - для снятия события.  
    `emit()` – инициировать событие с данными.   

Pеализованы методы  `onAll` и  `offAll`  — для подписки на все события и сброса всех подписчиков.  
Метод  `trigger` , генерирующий заданное событие с заданными аргументами. Это позволяет передавать его в качестве обработчика события в другие классы.

### 2.	Класс Api
Данный класс содержит базовый url и опции, которые необходимо добавить в запрос.  

Свойства:  
    ```
    readonly baseUrl: string - базовый url для запросов;  
	protected options: RequestInit - опции запроса;  
    ```

Констрктор: `baseUrl: string, options: RequestInit = {}`.

Методы класса:  
    `get()` - для получения данных.  
    `post()` - для отправки данных.  

### 3.	Класс Component<T>
Данный класс является абстрактным и необходим для создания компонентов интерфейса пользователя.  

Защищенный констрктор: `protected readonly container: HTMLElement`.

Методы класса:  
    `toggleClass()` - переключить класс.  
    `setText()` - установить текстовое содержимое.  
    `setImage()` - установить изображение с алтернативным текстом.  
    `setDisabled()` - сменить статус блокировки.  
    `setHidden()` - скрыть элемент.  
    `setVisible()` - показать элемент.  
    `render()` - вернуть корневой DOM-элемент.  

### 4. Класс Model<T>
Данный класс является абстрактным и необходим для создания структуры модели данных.  

Констрктор: `data: Partial<T>, protected events: IEvents`.

Метод класса:  
    `emitChanges()` - сообщить всем, что модель поменялась.  

## Компоненты модели данных

### 1.	Класс Product
Класс для создания и упрвления данными продукта. Предоставляет информацию о продукте.  
```
class Product extends Model<IProduct>  
```

### 2.	Класс AppState
Представляет состояние приложения, в том числе данные каталога, корзины, предпросмотра, заказа, ошибок формы.   
```
class AppState extends Model<IAppState>  
```

Конструткора нет.  

Методы класса:  
    `clearOrder()` - очистить данные заказа.  
    `clearBasket()` - очистить данные корзины.  
    `setCatalog()` - устанавить каталог продуктов, каждый элемент преобразовать в экземпляр Product.  
    `setPreview()` - устанавить предпросомотр продукта.  
    `addToBasket()` - добавить товар в корзину.  
    `removeFromBasket()` - удалить товар из корзины.  
    `updateBasket()` -  обновить данные корзины.  
    `setDeliveryField()` - устанавливает значени в данные доставки заказа.  
    `setPersonalField()` - устанавливает значени в данные личных данных заказа.  
    `validateDelivery()` - проверяет валидность формы доставки.  
    `validatePersonal()` - проверяет валидность формы личных данных.  


## Общие компоненты представления

### 1.	Класс Form
Класс для создания и управления формами. Здесь происходит обработка событий ввода/ отправки, отображение формы, проверка валидности формы.  
```
class Form extends Component<IFormState>  
```

Свойства:  
    ```
    protected _submit: HTMLButtonElement;  
	protected _errors: HTMLElement;  
    ```

Констрктор: `protected container: HTMLFormElement, protected events: IEvents`  

Методы класса:  
    `onInputChange()` - обработчик событий ввода.  
    `set valid()` - возможность отправки формы при ее валидности.  
    `set errors()` - отображает ошибки валидации формы.  


### 2.	Класс Modal
Данный класс реализует интерфейс модального окно. Возможности: открывать модальное окно, закрывть модальное окно, слушать события.  
```
class Modal extends Component<IModalData>  
```

Свойства:  
    ```
    protected _closeButton: HTMLButtonElement;  
	protected _content: HTMLElement;  
    ```

Конструктор: `container: HTMLElement, events: IEvents`  

Методы класса:  
    `open()` - открыть модальное окно.  
    `close()` - закрыть модальное окно.  

### 3.	Класс Basket
Реализует интерфейс модального окна корзины выбранных товаров. Дает возможность добавлять/ удалять товары в корзине.  
```
class Basket extends Component<IBasketView>  
```

Свойства:  
    ```
    protected _list: HTMLElement;  
	protected _total: HTMLElement;  
	protected _button: HTMLElement;  
    ```

Конструктор: `container: HTMLElement, protected events: EventEmitter`  

Методы класса:  
    `set items()` - отобразить все товары в корзине (или их отсутвие - "корзина пуста").  
    `set totalSum()` - установить общую стоимость всех товаров в корзине.  

### 4.	Класс Success
Реализует интерфейс для работы с модальным окном при успешном оформлении заказа.  
```
class Success extends Component<ISuccess>  
```

Свойства:  
    ```
    protected _close: HTMLElement;  
	protected _total: HTMLElement;  
    ```

Конструктор: `container: HTMLElement, actions: ISuccessActions`  

В конструктор класса передается действие: `onClick: () => void`.  

Метод класса:  
    `set totalSum()` - устанавливает итоговую сумму покупки.  



## Компоненты представления

### 1.	Класс Page
Класс отображает все элементы на странице: каталог товаров, счетчик товаров в корзине, не позволяет скроллить страницу.  
```
class Page extends Component<IPage>  
```

Свойства:  
    ```
    protected _counter: HTMLElement;  
	protected _catalog: HTMLElement;  
	protected _wrapper: HTMLElement;  
	protected _basket: HTMLElement;  
    ```

Констрктор: container: `HTMLElement, protected events: IEvents`.

Методы класса:  
    `set counter()` - установить значение счетчика.  
    `set catalog()` - заменить содержимое каталога.  
    `set locked()` - блокировка скроллинга страницы при неоходимости (и наоборот).  


### 2.	Класс Card
Данный класс реализует интерфейс карточки товара. Предназначен для отображения и взаимодействия с карточками товара.  
```
class Card extends Component<ICard>  
```

Свойства:  
    ```
    protected _title: HTMLElement;  
	protected _price: HTMLElement;  
	protected _image?: HTMLImageElement;  
	protected _description?: HTMLElement;  
	protected _button?: HTMLButtonElement;  
	protected _category?: HTMLElement;  
	protected _index?: HTMLElement;  
	protected _buttonText: string;  
    ```

Конструктор: `container: HTMLElement, actions?: ICardActions` - принимает контейнер карточки и действия, связанные с карточкой.  

Методы класса:  
    `set/get id()` - установить/получить индификатор карточки.  
    `set/get title()` - установить/получить название товара.  
    `set/get price()` - установить/получить цену товара.  
    `set/get category()` - установить/получить категорию товара.  
    `set/get index()` - установить/получить индекс товара.  
    `set image()` - установить/получить изображение товара.  
    `set description()` - установить/получить описание товара.  
    `set buttonText()` - устанавливает текст кнопки.  


### 3.	Класс DeliveryForm
Реализует интерфейс для взаимодействия с формой доставки. Возможно выбрать способ оплаты и ввести адрес доставки.  
```
class DeliveryForm extends Component<IDeliveryForm>  
```

Свойства:  
    ```
    protected _cardButton: HTMLButtonElement;  
	protected _cashButton: HTMLButtonElement;  
    ```

Конструктор: `container: HTMLFormElement, events: IEvents, actions?: ICardActions`  

Методы класса:  
   ` toggleButton()` - переключает кнопки выбора способа оплаты.  
    `set address()` - устанавливает адрес доставки.  


### 4.	Класс PersonalForm
Реализует интерфейс для работы с формой с персональными данными. Вохможен ввод email и номера телефона покупателя.  
```
class PersonalForm extends Component<IPersonalForm>  
```

Конструктор: `container: HTMLFormElement, events: IEvents`  

Методы класса:  
    `set phone()` - устанавить номер телефона.  
    `set email()` - устанавить адрес электронной почты.  


### 5.	Класс WebLarekAPI
Класс, который расширяет базовый класс Api. В нём описывыаются методы, которые понядобятся, чтобы сделать запросы к серверу.  
```
class WebLarekAPI extends Api implements IWebLarekAPI  
```

Свойства:  
    ```
    readonly cdn: string;  
    ```

Конструктор: `cdn: string, baseUrl: string, options?: RequestInit`  

Методы класса:  
    `getProductList()` - получить список товаров.  
    `getProductItem()` - получить товар.  
    `orderProducts()` - ззаказать товар.  