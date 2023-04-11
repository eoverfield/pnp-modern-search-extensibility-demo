import { ServiceKey, ServiceScope } from "@microsoft/sp-core-library";
import { PageContext } from "@microsoft/sp-page-context";
import { SPHttpClient, SPHttpClientResponse } from "@microsoft/sp-http";
import {  IExtensibilityLibrary, 
          IComponentDefinition, 
          ILayoutDefinition, 
          LayoutType, 
          ILayout,
          LayoutRenderType,
          ISuggestionProviderDefinition,
          IQueryModifierDefinition,
          IDataSourceDefinition,
         
} from "@pnp/modern-search-extensibility";
import * as Handlebars from "handlebars";

import { CustomSimpleListLayout } from "../layouts/results/customSimpleList/CustomSimpleListLayout";
import { CustomPeoplelayout } from "../layouts/results/customPeople/CustomPeopleLayout";
import { CustomPersonaWebComponent } from "./components/CustomPersonaComponent";
import { CustomPersonCardWebComponent } from "./components/CustomPersonCardComponent";



export class ExtensibilityDemoLibrary implements IExtensibilityLibrary {
  

  public static readonly serviceKey: ServiceKey<ExtensibilityDemoLibrary> =
  ServiceKey.create<ExtensibilityDemoLibrary>('SPFx:MyCustomLibraryComponent', ExtensibilityDemoLibrary);

  private _spHttpClient: SPHttpClient;
  private _pageContext: PageContext;
  private _currentWebUrl: string;

  constructor(serviceScope: ServiceScope) {
    serviceScope.whenFinished(() => {
      this._spHttpClient = serviceScope.consume(SPHttpClient.serviceKey);
      this._pageContext = serviceScope.consume(PageContext.serviceKey);
      this._currentWebUrl = this._pageContext.web.absoluteUrl;
    });
  }

  public getCustomLayouts(): ILayoutDefinition[] {
    return [
      {
        name: 'Custom Simple List',
        iconName: 'List',
        key: 'CustomSimpleListLayoutHandlebars',
        type: LayoutType.Results,
        renderType: LayoutRenderType.Handlebars,
        templateContent: require('../layouts/results/customSimpleList/custom-simple-list.html'),
        serviceKey: ServiceKey.create<ILayout>('PnP:CustomSimpleListLayoutHandlebars', CustomSimpleListLayout),
      },
      {
        name: 'Custom People',
        iconName: 'People',
        key: 'CustomPeopleLayoutHandlebars',
        type: LayoutType.Results,
        renderType: LayoutRenderType.Handlebars,
        templateContent: require('../layouts/results/customPeople/custom-people.html'),
        serviceKey: ServiceKey.create<ILayout>('PnP:CustomPeopleLayoutHandlebars', CustomPeoplelayout),
      }
    ];
  }

  public getCustomWebComponents(): IComponentDefinition<any>[] {
    return [
      {
        componentName: 'custom-persona',
        componentClass: CustomPersonaWebComponent

      },{
        componentName:'custom-person-card',
        componentClass: CustomPersonCardWebComponent
      }
    ];
  }

  public getCustomSuggestionProviders(): ISuggestionProviderDefinition[] {
    return [];
  }

  public registerHandlebarsCustomizations(namespace: typeof Handlebars) {

    // Register custom Handlebars helpers
    // Usage {{myHelper 'value'}}
    namespace.registerHelper('myHelper', (value: string) => {
      return new namespace.SafeString(value.toUpperCase());
    });
  }

  public invokeCardAction(action: any): void {
    
  }

  public getCustomQueryModifiers(): IQueryModifierDefinition[]
  {     
    return [];
  }

  public getCustomDataSources(): IDataSourceDefinition[] {
   return [];
  }

  public name(): string {
    return 'MyCustomLibraryComponent';
  }
}
