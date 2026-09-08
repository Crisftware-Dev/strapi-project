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

export interface ComponentInvoiceItem extends Struct.ComponentSchema {
  collectionName: 'components_component_invoice_items';
  info: {
    displayName: 'invoice_item';
    icon: 'filePdf';
  };
  attributes: {
    amount: Schema.Attribute.Decimal;
    description: Schema.Attribute.String;
    unit_price: Schema.Attribute.Decimal;
  };
}

export interface ComponentIssuerData extends Struct.ComponentSchema {
  collectionName: 'components_component_issuer_data';
  info: {
    displayName: 'issuer_data';
    icon: 'user';
  };
  attributes: {
    email: Schema.Attribute.Email;
    fullname: Schema.Attribute.String;
    lastname: Schema.Attribute.String;
    username: Schema.Attribute.String;
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

export interface ComponentPayment extends Struct.ComponentSchema {
  collectionName: 'components_component_payments';
  info: {
    displayName: 'payment';
    icon: 'wallet';
  };
  attributes: {
    amount: Schema.Attribute.Decimal & Schema.Attribute.Required;
    payment_date: Schema.Attribute.DateTime & Schema.Attribute.Required;
    payment_method: Schema.Attribute.Enumeration<
      ['EFECTIVO', 'TRANSFERENCIA', 'TARJETA']
    > &
      Schema.Attribute.DefaultTo<'EFECTIVO'>;
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
      'component.invoice-item': ComponentInvoiceItem;
      'component.issuer-data': ComponentIssuerData;
      'component.link': ComponentLink;
      'component.location': ComponentLocation;
      'component.payment': ComponentPayment;
      'component.references': ComponentReferences;
      'layout.login-section': LayoutLoginSection;
    }
  }
}
