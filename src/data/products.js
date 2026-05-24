export const LOGO_URL = 'https://raw.githubusercontent.com/axmads-arch/frontend/main/logo.jpg';

export const CATS = [
  { id: 'filter',    label: 'Фильтры',      isFilter: true },
  { id: 'breakfast', label: 'Завтраки',      icon: 'З'  },
  { id: 'salads',    label: 'Салаты',        icon: 'С'  },
  { id: 'sandwich',  label: 'Сэндвичи',      icon: 'СД' },
  { id: 'mains',     label: 'Вторые блюда',  icon: 'ВБ' },
  { id: 'soups',     label: 'Супы',          icon: 'СП' },
  { id: 'pastry',    label: 'Выпечка',       icon: 'В'  },
  { id: 'drinks',    label: 'Напитки',       icon: 'Н'  },
  { id: 'desserts',  label: 'Десерты',       icon: 'Д'  },
];

export const PRODUCTS = [
  { id:1,  name:'Шакшука',              price:49000, cat:'breakfast', img:'https://images.unsplash.com/photo-1590412200988-a436970781fa?w=400&q=75' },
  { id:2,  name:'Французский завтрак',  price:44000, cat:'breakfast', img:'https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=400&q=75' },
  { id:3,  name:'Сырники со сметаной',  price:35000, cat:'breakfast', img:'https://images.unsplash.com/photo-1567620905732-2d1ec7ab7445?w=400&q=75' },
  { id:4,  name:'Омлет с овощами',      price:28000, cat:'breakfast', img:'https://images.unsplash.com/photo-1510693206972-df098062cb71?w=400&q=75' },
  { id:5,  name:'Яичница с беконом',    price:32000, cat:'breakfast', img:'https://images.unsplash.com/photo-1525351484163-7529414344d8?w=400&q=75' },
  { id:6,  name:'Салат Цезарь',         price:42000, cat:'salads',    img:'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&q=75' },
  { id:7,  name:'Салат Оливье',         price:29000, cat:'salads',    img:'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&q=75' },
  { id:8,  name:'Греческий салат',      price:36000, cat:'salads',    img:'https://images.unsplash.com/photo-1529059997568-3d847b1154f0?w=400&q=75' },
  { id:9,  name:'Клаб сэндвич',         price:38000, cat:'sandwich',  img:'https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=400&q=75' },
  { id:10, name:'Бургер классик',       price:52000, cat:'sandwich',  img:'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&q=75' },
  { id:11, name:'Плов по-узбекски',     price:65000, cat:'mains',     img:'https://images.unsplash.com/photo-1596560548464-f010549b84d7?w=400&q=75' },
  { id:12, name:'Манты с мясом',        price:49000, cat:'mains',     img:'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=400&q=75' },
  { id:13, name:'Шашлык говяжий',       price:89000, cat:'mains',     img:'https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=75' },
  { id:14, name:'Лагман',               price:45000, cat:'soups',     img:'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&q=75' },
  { id:15, name:'Шурпа',                price:52000, cat:'soups',     img:'https://images.unsplash.com/photo-1604152135912-04a022e23696?w=400&q=75' },
  { id:16, name:'Самса слоёная',        price:18000, cat:'pastry',    img:'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=400&q=75' },
  { id:17, name:'Лепёшка тандир',       price:12000, cat:'pastry',    img:'https://images.unsplash.com/photo-1509440159596-0249088772ff?w=400&q=75' },
  { id:18, name:'Чай зелёный',          price:8000,  cat:'drinks',    img:'https://images.unsplash.com/photo-1556679343-c7306c1976bc?w=400&q=75' },
  { id:19, name:'Свежевыжатый сок',     price:22000, cat:'drinks',    img:'https://images.unsplash.com/photo-1600271886742-f049cd451bba?w=400&q=75' },
  { id:20, name:'Чак-чак медовый',      price:25000, cat:'desserts',  img:'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&q=75' },
  { id:21, name:'Наполеон',             price:32000, cat:'desserts',  img:'https://images.unsplash.com/photo-1565958011703-44f9829ba187?w=400&q=75' },
  { id:22, name:'Тирамису',             price:38000, cat:'desserts',  img:'https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=400&q=75' },
];

export const SORT_OPTS = [
  { id: 'az',        label: 'От А до Я'            },
  { id: 'rating',    label: 'По оценкам клиентов'  },
  { id: 'cheap',     label: 'Сначала дешевле'      },
  { id: 'expensive', label: 'Сначала дороже'       },
];

export const MENU_ITEMS = [
  { icon: '💳', label: 'Мои карты'  },
  { icon: 'ℹ️', label: 'О нас'      },
  { icon: '📍', label: 'Филиалы'    },
  { icon: '🏷', label: 'Акции'      },
  { icon: '📞', label: 'Контакты'   },
  { icon: '🌐', label: 'Язык'       },
];

export const fmt = n => n.toLocaleString('ru') + ' UZS';

export const totalItems = cart =>
  Object.values(cart).reduce((a, b) => a + b, 0);

export const totalPrice = cart =>
  Object.entries(cart).reduce((s, [id, qty]) => {
    const p = PRODUCTS.find(p => p.id === Number(id));
    return s + (p ? p.price * qty : 0);
  }, 0);
