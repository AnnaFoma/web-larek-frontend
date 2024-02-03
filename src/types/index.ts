export type ApiListResponse<Type> = {
    total: number,
    items: Type[]
};

export type ApiPostMethods = 'POST' | 'PUT' | 'DELETE';

export type EventName = string | RegExp;
export type Subscriber = Function;
export type EmitterEvent = {
    eventName: string,
    data: unknown
};

export interface IEvents {
    on<T extends object>(event: EventName, callback: (data: T) => void): void;
    emit<T extends object>(event: string, data?: T): void;
    trigger<T extends object>(event: string, context?: Partial<T>): (data: T) => void;
};

export interface IAppState {
    catalog: IProduct[];
    basket: IProduct[];
    preview: string | null;
    order: IOrder | null;
}
export type FormErrors = Partial<Record<keyof IOrder, string>>;

export interface IWebLarekAPI {
    getProductList: () => Promise<IProduct[]>;
    getProductItem: (id: string) => Promise<IProduct>;
    orderProducts: (order: IOrder) => Promise<IOrderResult>
}

export interface IProduct {
    id: string;
    category: string;
    image: string;
    title: string;
    price: number | null;
    description: string;
}

export interface ICard<T> {
    title: string;
    description?: string | string[];
    image: string;
    status: T;
}

export interface IPage {
    counter: number;
    catalog: HTMLElement[];
    locked: boolean;
}

export interface IFormState {
    valid: boolean;
    errors: string[];
}

export interface IModalData {
    content: HTMLElement;
}

export interface IBasketView {
    items: HTMLElement[];
    total: number;
    selected: string[];
}

export interface IPersonalForm {
	email: string;
	phone: string;
}

export interface IDeliveryForm {
	payment: string;
	address: string;
}

export interface IOrder extends IPersonalForm, IDeliveryForm {
	total: number;
    items: string[];
}

export interface IOrderResult {
    id: string;
}

export interface ISuccess {
    total: number;
}