import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef,
} from 'react';
import { Product } from 'types';

type Cart = {
  items: { product: Product; count: number }[];
  itemsCount: number;
  totalPrice: number;
  updated: boolean;
};

type ACTION_TYPE =
  | {
      type: 'add-item';
      payload: { product: Product; count: number };
    }
  | {
      type: 'update-item';
      payload: { product: Product; count: number };
    }
  | {
      type: 'remove-item';
      payload: { product: Product };
    }
  | {
      type: 'clear-cart';
    }
  | {
      type: 'update-cart';
      payload: Cart;
    };

const CartContext = createContext<Cart>({} as Cart);
const CartDispatchContext = createContext<React.Dispatch<ACTION_TYPE>>(
  {} as React.Dispatch<ACTION_TYPE>,
);

const INITIAL: Cart = {
  items: [],
  itemsCount: 0,
  totalPrice: 0,
  updated: false,
};

const cartReducer = (state: Cart, action: ACTION_TYPE): Cart => {
  switch (action.type) {
    case 'add-item': {
      const { product, count } = action.payload;
      const item = state.items.find((i) => i.product._id === product._id);

      // check if item exists in cart
      if (item) {
        const items = state.items.map((i) =>
          i === item ? { ...i, count: i.count + count } : i,
        );

        return {
          items,
          itemsCount: state.itemsCount + count,
          totalPrice: state.totalPrice + count * product.price,
          updated: false,
        };
      }
      // add item in cart
      return {
        items: [...state.items, { product, count }],
        itemsCount: state.itemsCount + count,
        totalPrice: state.totalPrice + count * product.price,
        updated: false,
      };
    }

    case 'update-item': {
      const { product, count } = action.payload;
      const item = state.items.find((i) => i.product._id === product._id);

      return item && +count > 0
        ? {
            items: state.items.map((i) =>
              i.product.name === product.name ? { ...i, count } : i,
            ),
            itemsCount: state.itemsCount - item.count + count,
            totalPrice:
              state.totalPrice -
              item.count * item.product.price +
              count * product.price,
            updated: false,
          }
        : state;
    }

    case 'remove-item': {
      const { product } = action.payload;
      const item = state.items.find((i) => i.product._id === product._id);

      return item
        ? {
            items: state.items.filter((i) => i !== item),
            itemsCount: state.itemsCount - item.count,
            totalPrice: state.totalPrice - item.count * item.product.price,
            updated: false,
          }
        : state;
    }

    case 'clear-cart': {
      return { ...INITIAL };
    }

    case 'update-cart': {
      return {
        ...action.payload,
        updated: true,
      };
    }

    default:
      throw new Error(`Unhandled action type`);
  }
};

const CartProvider: React.FC = ({ children }) => {
  const firstLoad = useRef(true);
  const [state, dispatch] = useReducer(cartReducer, { ...INITIAL });

  useEffect(() => {
    if (firstLoad.current) {
      const cart: Cart = JSON.parse(localStorage.getItem('cart') || '{}');
      firstLoad.current = false;

      dispatch({ type: 'update-cart', payload: { ...INITIAL, ...cart } });
    } else if (!state.updated) {
      localStorage.setItem('cart', JSON.stringify(state));
    }
  }, [state]);

  return (
    <CartContext.Provider value={state}>
      <CartDispatchContext.Provider value={dispatch}>
        {children}
      </CartDispatchContext.Provider>
    </CartContext.Provider>
  );
};

const useCartState = () => {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCartState must be used within a CartProvider');
  }

  return context;
};

const useCartDispatch = () => {
  const context = useContext(CartDispatchContext);

  if (!context) {
    throw new Error('CartDispatchContext must be used within a CartProvider');
  }

  return context;
};

const useCart = (): [cart: Cart, cartDispatch: React.Dispatch<ACTION_TYPE>] => {
  return [useCartState(), useCartDispatch()];
};

export { CartProvider, useCart, useCartState, useCartDispatch };
