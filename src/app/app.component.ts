import { Component, OnInit, AfterViewInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';

import { RoutePartsService } from './shared/services/route-parts.service';
import { InjectorsHelper, injectorsGlobal } from 'app/shared/services/injectors_global.service';

import { filter } from 'rxjs/operators';

import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, AfterViewInit {
  appTitle = 'Egret';
  pageTitle = '';

  constructor(
    public title: Title,
    private router: Router,
    private injectorsHelper: InjectorsHelper,
    private activeRoute: ActivatedRoute,
    private routePartsService: RoutePartsService,
    private translate: TranslateService
  ) {
    translate.setDefaultLang('es');
  }

  ngOnInit() {
    this.changePageTitle();
  }
  ngAfterViewInit() {}
  changePageTitle() {
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(routeChange => {
      var routeParts = this.routePartsService.generateRouteParts(this.activeRoute.snapshot);
      if (!routeParts.length) return this.title.setTitle(this.appTitle);
      // Extract title from parts;
      this.pageTitle = routeParts
        .reverse()
        .map(part => part.title)
        .reduce((partA, partI) => {
          return `${this.translate.instant(partA)} > ${this.translate.instant(partI)}`;
        });

      this.pageTitle += ` | ${this.appTitle}`;
      this.title.setTitle(this.pageTitle);
    });
  }
}
