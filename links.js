import CartSvg from '@icons/cart.svg';
import LoginSvg from '@icons/login.svg';
import LogoutSvg from '@icons/logout.svg';
import PhoneSvg from '@icons/phone.svg';
import EmailSvg from '@icons/email.svg';
import PackageSvg from '@icons/package.svg';
import BriefcaseSvg from '@icons/briefcase.svg';

const linkFactory = ({
  path,
  text,
  label,
  Icon = null,
  accent = true,
  privatePath = false,
  managementPath = false
}) => ({
  path,
  text,
  label,
  Icon,
  accent,
  privatePath,
  managementPath
});

export const categoriesLink = linkFactory({
  path: '/categories',
  text: 'Ceai',
  label: 'Deschideți pagina cu categorii',
  accent: false
});

export const aboutLink = linkFactory({
  path: '/about',
  text: 'Despre',
  label: 'Deschideți pagina cu informații despre noi',
  accent: false
});

export const contactsLink = linkFactory({
  path: '/contacts',
  text: 'Contacte',
  label: 'Deschideți pagina cu contacte',
  accent: false
});

export const cartLink = linkFactory({
  path: '/cart',
  text: 'Coș',
  label: 'Deschideți pagina cu coșul personal',
  Icon: CartSvg,
  accent: false
});

export const loginLink = linkFactory({
  path: '/login',
  text: 'Conectați-vă',
  label: 'Deschideți pagina pentru conectare',
  Icon: LoginSvg
});

export const myOrdersLink = linkFactory({
  path: '/my-orders',
  text: 'Comenzile Mele',
  label: 'Deschideți pagina cu comenziile efectuate',
  Icon: PackageSvg,
  accent: false,
  privatePath: true
});

export const logoutLink = linkFactory({
  path: '/login',
  text: 'Deconectare',
  label: 'Deconectare din account',
  Icon: LogoutSvg,
  privatePath: true,
  accent: false
});

export const managementLink = linkFactory({
  path: '/management',
  text: 'Managment',
  label: 'Managment',
  Icon: BriefcaseSvg,
  privatePath: true,
  accent: true,
  managementPath: true
});

export const navLinks = [
  managementLink,
  categoriesLink,
  aboutLink,
  contactsLink,
  cartLink,
  loginLink,
  myOrdersLink,
  logoutLink
];

export const footerBlockLinksList = [
  {
    ...aboutLink,
    links: [
      linkFactory({
        path: '/about',
        text: 'vreau ceai',
        label: 'Deschideți pagina cu informații despre noi'
      })
    ]
  },
  {
    ...linkFactory({
      path: '/faq',
      text: 'FAQ',
      label: 'Deschideți pagina cu întrebări frecvente',
      accent: false
    }),
    links: [
      linkFactory({
        path: '/faq#cum-comand',
        text: 'cum comand',
        label: 'Deschideți pagina cu întrebarea cum comand'
      }),
      linkFactory({
        path: '/faq#cum-achit',
        text: 'cum achit',
        label: 'Deschideți pagina cu întrebarea cum achit'
      }),
      linkFactory({
        path: '/faq#livrare',
        text: 'cum are loc livrarea',
        label: 'Deschideți pagina cu întrebarea despre cum are loc livrarea'
      })
    ]
  },
  {
    ...contactsLink,
    links: [
      linkFactory({
        path: 'tel:062222222',
        text: '062222222',
        label: 'apelați nr de tel',
        Icon: PhoneSvg
      }),
      linkFactory({
        path: 'mailto:vreauceai@gmail.com',
        text: 'vreauceai@gmail.com',
        label: 'trimiteți email',
        Icon: EmailSvg
      })
    ]
  }
];
