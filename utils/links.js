import CartSvg from '@/icons/cart.svg';
import LoginSvg from '@/icons/login.svg';
import LogoutSvg from '@/icons/logout.svg';
import PhoneSvg from '@/icons/phone.svg';
import EmailSvg from '@/icons/email.svg';
import PackageSvg from '@/icons/package.svg';
import BriefcaseSvg from '@/icons/briefcase.svg';

const linkFactory = ({
  href,
  text,
  label,
  Icon = null,
  accent = true,
  privatePath = false,
  managementPath = false
}) => ({
  href,
  text,
  label,
  Icon,
  accent,
  privatePath,
  managementPath
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

export const myOrdersLink = linkFactory({
  href: '/my-orders',
  text: 'Comenzile Mele',
  label: 'Deschideți pagina cu comenziile efectuate',
  Icon: PackageSvg,
  accent: false,
  privatePath: true
});

export const logoutLink = linkFactory({
  href: '/login',
  text: 'Deconectare',
  label: 'Deconectare din account',
  Icon: LogoutSvg,
  privatePath: true,
  accent: false
});

export const managementLink = linkFactory({
  href: '/management',
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
