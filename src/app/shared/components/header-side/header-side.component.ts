import { Component, OnInit, Input } from '@angular/core';
import { ThemeService } from '../../services/theme.service';
import { LayoutService } from '../../services/layout.service';
import { TranslateService } from '@ngx-translate/core';
import { UserSession } from 'app/shared/services/user-session';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header-side',
  templateUrl: './header-side.template.html'
})
export class HeaderSideComponent implements OnInit {
  @Input() notificPanel;
  public availableLangs = [
    {
      name: 'EN',
      code: 'en',
      flag: 'flag-icon-us'
    },
    {
      name: 'ES',
      code: 'es',
      flag: 'flag-icon-es'
    }
  ];
  currentLang = this.availableLangs[0];

  public egretThemes;
  public layoutConf: any;
  constructor(
    private themeService: ThemeService,
    private layout: LayoutService,
    private router: Router,
    public translate: TranslateService
  ) {}
  ngOnInit() {
    this.egretThemes = this.themeService.egretThemes;
    this.layoutConf = this.layout.layoutConf;
    this.translate.use(this.currentLang.code);
  }
  setLang(lng) {
    this.currentLang = lng;
    this.translate.use(lng.code);
  }
  toggleNotific() {
    this.notificPanel.toggle();
  }
  toggleSidenav() {
    if (this.layoutConf.sidebarStyle === 'closed') {
      return this.layout.publishLayoutChange({
        sidebarStyle: 'full'
      });
    }
    this.layout.publishLayoutChange({
      sidebarStyle: 'closed'
    });
  }

  toggleCollapse() {
    // compact --> full
    if (this.layoutConf.sidebarStyle === 'compact') {
      return this.layout.publishLayoutChange(
        {
          sidebarStyle: 'full',
          sidebarCompactToggle: false
        },
        { transitionClass: true }
      );
    }

    // * --> compact
    this.layout.publishLayoutChange(
      {
        sidebarStyle: 'compact',
        sidebarCompactToggle: true
      },
      { transitionClass: true }
    );
  }

  signOut() {
    UserSession.removeCurrentUser();
    this.router.navigate(['/sessions/sign_in']);
  }
}
