import AbstractView from '../framework/view/abstract-view.js';
import { getStrStartWithCapitalLetters } from '../utils/common.js';
import { getHours, getMonth, getDifferenceInTime } from '../utils/waypoint.js';

function createOfferTemplate({title, price}) {
  return (
    `<li class="event__offer">
      <span class="event__offer-title">${title}</span>
      &plus;&euro;&nbsp;
      <span class="event__offer-price">${price}</span>
    </li>`
  );
}

function createWaypointTemplate(point, destinations, offers) {
  const { type, basePrice, dateFrom, dateTo, destination, isFavorite, offers: pointOffers } = point;

  const currentDestination = destinations.find((el) => el.id === destination).name;

  const createEventTitle = `${getStrStartWithCapitalLetters(type)} ${getStrStartWithCapitalLetters(currentDestination)}`;

  const offersForType = offers.find((offer) => offer.type === type).offers;

  const pointOffersList = pointOffers.map((pointOffer) => offersForType.find((offer) => offer.id === pointOffer));

  return (
    `<li class="trip-events__item">
      <div class="event">
        <time class="event__date" datetime="${dateFrom}">${getMonth(dateFrom)}</time>
        <div class="event__type">
          <img class="event__type-icon" width="42" height="42" src="img/icons/${type}.png" alt="${type}">
        </div>
        <h3 class="event__title">${createEventTitle}</h3>
        <div class="event__schedule">
          <p class="event__time">
            <time class="event__start-time" datetime="2019-03-18T10:30">${getHours(dateFrom)}</time>
            &mdash;
            <time class="event__end-time" datetime="2019-03-18T11:00">${getHours(dateTo)}</time>
          </p>
          <p class="event__duration">${getDifferenceInTime(dateFrom, dateTo)}</p>
        </div>
        <p class="event__price">
          &euro;&nbsp;<span class="event__price-value">${basePrice}</span>
        </p>
        <h4 class="visually-hidden">Offers:</h4>
        <ul class="event__selected-offers">
          ${pointOffersList.map((offer) => createOfferTemplate(offer)).join('')}
        </ul>
        <button class="event__favorite-btn ${isFavorite && 'event__favorite-btn--active'}" type="button">
          <span class="visually-hidden">Add to favorite</span>
          <svg class="event__favorite-icon" width="28" height="28" viewBox="0 0 28 28">
            <path d="M14 21l-8.22899 4.3262 1.57159-9.1631L.685209 9.67376 9.8855 8.33688 14 0l4.1145 8.33688 9.2003 1.33688-6.6574 6.48934 1.5716 9.1631L14 21z"/>
          </svg>
        </button>
        <button class="event__rollup-btn" type="button">
          <span class="visually-hidden">Open event</span>
        </button>
      </div>
    </li>`
  );
}

export default class WaypointView extends AbstractView {
  #point = null;
  #destinations = null;
  #offers = null;
  #handleEditClick = null;

  constructor({point, destinations, offers, onEditClick}) {
    super();
    this.#point = point;
    this.#destinations = destinations;
    this.#offers = offers;
    this.#handleEditClick = onEditClick;

    this.element.querySelector('.event__rollup-btn').addEventListener('click', this.#editClickHandler);
  }

  get template() {
    return createWaypointTemplate(this.#point, this.#destinations, this.#offers);
  }

  #editClickHandler = (evt) => {
    evt.preventDefault();
    this.#handleEditClick();
  };
}
