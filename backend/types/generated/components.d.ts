import type { Schema, Struct } from '@strapi/strapi';

export interface ComponentContact extends Struct.ComponentSchema {
  collectionName: 'components_component_contacts';
  info: {
    displayName: 'contact';
  };
  attributes: {
    phoneSms: Schema.Attribute.String;
    phoneTwo: Schema.Attribute.String;
    telephone: Schema.Attribute.String;
  };
}

export interface ComponentDiscountLaw extends Struct.ComponentSchema {
  collectionName: 'components_component_discount_laws';
  info: {
    displayName: 'discountLaw';
  };
  attributes: {
    disability: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
    oldAge: Schema.Attribute.Boolean & Schema.Attribute.DefaultTo<false>;
  };
}

export interface ComponentFile extends Struct.ComponentSchema {
  collectionName: 'components_component_files';
  info: {
    displayName: 'file';
  };
  attributes: {
    file: Schema.Attribute.Media<
      'images' | 'files' | 'videos' | 'audios',
      true
    >;
    filename: Schema.Attribute.String;
    name: Schema.Attribute.String;
  };
}

export interface ComponentLink extends Struct.ComponentSchema {
  collectionName: 'components_component_links';
  info: {
    displayName: 'Link';
    icon: 'apps';
  };
  attributes: {
    href: Schema.Attribute.String &
      Schema.Attribute.Required &
      Schema.Attribute.DefaultTo<'#'>;
    isExternal: Schema.Attribute.Boolean;
    label: Schema.Attribute.String;
  };
}

export interface ComponentLocation extends Struct.ComponentSchema {
  collectionName: 'components_component_locations';
  info: {
    displayName: 'location';
  };
  attributes: {
    latitude: Schema.Attribute.String;
    longitude: Schema.Attribute.String;
  };
}

export interface ComponentReferences extends Struct.ComponentSchema {
  collectionName: 'components_component_references';
  info: {
    displayName: 'references';
  };
  attributes: {
    fullnames: Schema.Attribute.String;
    identificacion: Schema.Attribute.String;
    phone: Schema.Attribute.BigInteger;
    relationship: Schema.Attribute.String;
  };
}

export interface LayoutLoginSection extends Struct.ComponentSchema {
  collectionName: 'components_layout_login_sections';
  info: {
    displayName: 'Login Section';
    icon: 'link';
  };
  attributes: {
    images_demostratives: Schema.Attribute.Media<'images' | 'files', true> &
      Schema.Attribute.Required;
    label: Schema.Attribute.String & Schema.Attribute.Required;
  };
}

declare module '@strapi/strapi' {
  export namespace Public {
    export interface ComponentSchemas {
      'component.contact': ComponentContact;
      'component.discount-law': ComponentDiscountLaw;
      'component.file': ComponentFile;
      'component.link': ComponentLink;
      'component.location': ComponentLocation;
      'component.references': ComponentReferences;
      'layout.login-section': LayoutLoginSection;
    }
  }
}
