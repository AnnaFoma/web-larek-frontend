import { Component } from './base/Component';
import { ICard, ICardActions } from '../types';
import { ensureElement } from '../utils/utils';

export class Card extends Component<ICard> {
	protected _title: HTMLElement;
	protected _price: HTMLElement;
	protected _image?: HTMLImageElement;
	protected _description?: HTMLElement;
	protected _button?: HTMLButtonElement;
	protected _category: HTMLElement;
	protected _index?: HTMLElement;
	protected _buttonText: string;

	private KindOfcategory: Record<string, string> = {
		'софт-скил': '_soft',
		'хард-скил': '_hard',
		'кнопка': '_button',
		'дополнительное': '_additional',
		'другое': '_other',
	};

	constructor(container: HTMLElement, actions?: ICardActions) {
		super(container);

		this._title = ensureElement<HTMLElement>('.card__title', container);
		this._price = ensureElement<HTMLElement>('.card__price', container);
		this._image = container.querySelector('.card__image');
		this._button = container.querySelector('.card__button');
		this._description = container.querySelector('.card__text');
		this._category = container.querySelector('.card__category');
		this._index = container.querySelector('.basket__item-index');

		if (actions?.onClick) {
			if (this._button) {
				this._button.addEventListener('click', actions.onClick);
			} else {
				container.addEventListener('click', actions.onClick);
			}
		}
	}

	set id(value: string) {
		this.container.dataset.id = value;
	}

	get id(): string {
		return this.container.dataset.id || '';
	}

	set title(value: string) {
		this.setText(this._title, value);
	}

	get title(): string {
		return this._title.textContent || '';
	}

	set price(value: number | null) {
		this.setText(
			this._price,
			value ? `${value.toString()} синапсов` : 'Бесценно'
		);
	}

	get price(): number {
		return Number(this._price.textContent || '');
	}

	set category(value: string) {
		this.setText(this._category, value);

		const CardCategoryClass = this._category.classList[0];

		this._category.className = '';
		this._category.classList.add(`${CardCategoryClass}`);
		this._category.classList.add(
			`${CardCategoryClass}${this.KindOfcategory[value]}`
		);
	}

	get category(): string {
		return this._category.textContent || '';
	}

	set index(value: string) {
		this._index.textContent = value;
	}

	get index(): string {
		return this._index.textContent || '';
	}

	set image(value: string) {
		this.setImage(this._image, value, this.title);
	}

	set description(value: string) {
		this.setText(this._description, value);
	}

	set buttonText(value: string) {
		if (this._button) {
			this._button.textContent = value;
		}
	}
}
