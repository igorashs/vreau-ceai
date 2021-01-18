import CartSvg from '@/icons/cart.svg';
import LoginSvg from '@/icons/login.svg';
import PhoneSvg from '@/icons/phone.svg';
import EmailSvg from '@/icons/email.svg';
import PackageSvg from '@/icons/package.svg';
import BriefcaseSvg from '@/icons/briefcase.svg';

const linkFactory = ({
  href,
  text,
  label,
  Icon = null,
  accent = 'light',
  privatePath = false,
  managementPath = false,
  underline = false
}) => ({
  href,
  text,
  label,
  Icon,
  accent,
  privatePath,
  managementPath,
  underline
});

export const categoriesLink = linkFactory({
  href: '/categories',
  text: 'Ceai',
  label: 'Deschideți pagina cu categorii',
  accent: false
});

export const aboutLink = linkFactory({
  href: '/about',
  text: 'Despre',
  label: 'Deschideți pagina cu informații despre noi',
  accent: false
});

export const contactsLink = linkFactory({
  href: '/contacts',
  text: 'Contacte',
  label: 'Deschideți pagina cu contacte',
  accent: false
});

export const cartLink = linkFactory({
  href: '/cart',
  text: 'Coș',
  label: 'Deschideți pagina cu coșul personal',
  Icon: CartSvg,
  accent: false
});

export const loginLink = linkFactory({
  href: '/login',
  text: 'Conectați-vă',
  label: 'Deschideți pagina pentru conectare',
  Icon: LoginSvg
});

export const signupLink = linkFactory({
  href: '/signup',
  text: 'Creați un cont',
  label: 'Deschideți pagina pentru conectare'
});

export const myOrdersLink = linkFactory({
  href: '/my-orders',
  text: 'Comenzile Mele',
  label: 'Deschideți pagina cu comenziile efectuate',
  Icon: PackageSvg,
  accent: false,
  privatePath: true
});

export const managementLink = linkFactory({
  href: '/management',
  text: 'Managment',
  label: 'Managment',
  Icon: BriefcaseSvg,
  privatePath: true,
  managementPath: true
});

export const phoneLink = linkFactory({
  href: 'tel:062222222',
  text: '062222222',
  label: 'apelați nr de tel',
  Icon: PhoneSvg
});

export const emailLink = linkFactory({
  href: 'mailto:vreauceai@gmail.com',
  text: 'vreauceai@gmail.com',
  label: 'trimiteți email',
  Icon: EmailSvg
});

export const navLinks = {
  public: [categoriesLink, aboutLink, contactsLink, cartLink, loginLink],
  private: [categoriesLink, aboutLink, contactsLink, cartLink, myOrdersLink],
  management: [
    managementLink,
    categoriesLink,
    aboutLink,
    contactsLink,
    cartLink,
    myOrdersLink
  ]
};

export const managementLinks = {
  users: [
    linkFactory({
      href: '/management/users/update#form',
      text: 'Modificare Utilizator',
      accent: 'dark'
    })
  ],

  orders: [
    linkFactory({
      href: '/management/orders/all',
      text: 'Toate comenzile',
      accent: 'dark'
    }),
    linkFactory({
      href: '/management/orders/update',
      text: 'Modificare comandă',
      accent: 'dark'
    })
  ],

  products: [
    linkFactory({
      href: '/management/products/all',
      text: 'Toate produsele',
      accent: 'dark'
    }),
    linkFactory({
      href: '/management/products/update',
      text: 'Modificare produs',
      accent: 'dark'
    }),
    linkFactory({
      href: '/management/products/add',
      text: 'Adăugare produs',
      accent: 'dark'
    })
  ],

  categories: [
    linkFactory({
      href: '/management/categories/all',
      text: 'Toate categoriile',
      accent: 'dark'
    }),
    linkFactory({
      href: '/management/categories/update',
      text: 'Modificare categorie',
      accent: 'dark'
    }),
    linkFactory({
      href: '/management/categories/add',
      text: 'Adăugare categorie',
      accent: 'dark'
    })
  ]
};

export const footerBlockLinksList = [
  {
    ...aboutLink,
    links: [
      linkFactory({
        href: '/about',
        text: 'vreau ceai',
        label: 'Deschideți pagina cu informații despre noi'
      })
    ]
  },
  {
    ...linkFactory({
      href: '/faq',
      text: 'FAQ',
      label: 'Deschideți pagina cu întrebări frecvente',
      accent: false
    }),
    links: [
      linkFactory({
        href: '/faq#cum-comand',
        text: 'cum comand',
        label: 'Deschideți pagina cu întrebarea cum comand'
      }),
      linkFactory({
        href: '/faq#cum-achit',
        text: 'cum achit',
        label: 'Deschideți pagina cu întrebarea cum achit'
      }),
      linkFactory({
        href: '/faq#livrare',
        text: 'cum are loc livrarea',
        label: 'Deschideți pagina cu întrebarea despre cum are loc livrarea'
      })
    ]
  },
  {
    ...contactsLink,
    links: [{ ...phoneLink }, { ...emailLink }]
  }
];
