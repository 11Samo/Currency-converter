import { Component } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

export interface row {
  firstValue: string;
  secondValue: string;
}
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
})
export class AppComponent {
  currencyRates: { [key: string]: number };
  url =
    'https://v6.exchangerate-api.com/v6/08ee0c8c9c6e09030bd78d0e/latest/USD';

  quantityInputEl: Element;
  convertTextEl: Element;
  conversionTypesEl: Element;
  tableEl: Element;
  buttonEl: Element;
  sumEl: Element;
  czkEl: Element;
  eurEl: Element;
  quantityValue: number;
  sum = 0;
  conversionType: string;
  disabled: boolean = true;
  tableRows: row[] = [];

  constructor(private toastr: ToastrService) {}

  ngOnInit() {
    this.quantityInputEl = document.querySelector('#quantity');
    this.convertTextEl = document.querySelector('.value-in-usd');
    this.conversionTypesEl = document.querySelector('#conversionType');
    this.tableEl = document.querySelector('.table-body');
    this.buttonEl = document.querySelector('button');
    this.sumEl = document.querySelector('.sum-value');
    this.czkEl = document.querySelector('.czk-rate');
    this.eurEl = document.querySelector('.eur-rate');
    this.conversionType = 'eur';
    this.exchangeRates();
  }

  async exchangeRates() {
    const res = await fetch(this.url);
    const data = await res.json();
    const conversionRates = data.conversion_rates;

    if (conversionRates) {
      this.currencyRates = {
        czk: conversionRates.CZK,
        eur: conversionRates.EUR,
        usd: conversionRates.USD,
      };
    } else {
      this.toastr.error(
        'Problem with connect on currency server. Set default currency rates!!',
        'Error'
      );
      this.currencyRates = {
        czk: 21.7,
        eur: 0.85,
        usd: 1,
      };
    }

    this.czkEl.textContent = `1 USD = ${this.currencyRates['czk']} CZK`;
    this.eurEl.textContent = `1 USD = ${this.currencyRates['eur']} EUR`;
  }

  getValueWithUSD(value: string) {
    return `${value} USD`;
  }

  calculateCurrency() {
    const result = (
      this.quantityValue / this.currencyRates[this.conversionType]
    ).toFixed(2);
    this.convertTextEl.textContent = this.getValueWithUSD(result);
    return Number(result);
  }

  changeInput() {
    if (this.quantityValue > 0) {
      this.disabled = false;
    } else {
      this.disabled = true;
    }

    this.calculateCurrency();
  }

  changeSelect() {
    this.calculateCurrency();
  }

  clickButton() {
    const convertValue = this.calculateCurrency();
    const row = {
      firstValue: this.quantityValue + ' ' + this.conversionType.toUpperCase(),
      secondValue: this.getValueWithUSD(convertValue.toString()),
    };
    this.tableRows.push(row);
    this.sum += convertValue;
    const sumFixed = this.sum.toFixed(2);
    this.sum = Number(sumFixed);
  }
}
