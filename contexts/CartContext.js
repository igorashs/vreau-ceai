import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useRef
} from 'react';

const CartContext = createContext();
const CartDispatchContext = createContext();

const INITIAL = {
  items: [],
  itemsCount: 0,
  totalPrice: 0
};

function cartReducer(state, action) {
  switch (action.type) {
    case 'add-item': {
      const { product, count } = action.payload;
      const item = state.items.find((i) => i.product.name === product.name);

      // check if item exists in cart
      if (item) {
        const items = state.items.map((i) =>
          i === item ? { ...i, count: i.count + count } : i
        );

        return {
          items,
          itemsCount: state.itemsCount + count,
          totalPrice: state.totalPrice + count * product.price
        };
      } else {
        // add item in cart
        return {
          items: [...state.items, { product, count }],
          itemsCount: state.itemsCount + count,
          totalPrice: state.totalPrice + count * product.price
        };
      }
    }

    case 'update-item': {
      const { product, count } = action.payload;
      const item = state.items.find((i) => i.product.name === product.name);

      return item && +count > 0
        ? {
            items: state.items.map((i) =>
              i.product.name === product.name ? { ...i, count } : i
            ),
            itemsCount: state.itemsCount - item.count + count,
            totalPrice:
              state.totalPrice -
              item.count * item.product.price +
              count * product.price
          }
        : state;
    }

    case 'remove-item': {
      const { product } = action.payload;
      const item = state.items.find((i) => i.product.name === product.name);

      return item
        ? {
            items: state.items.filter((i) => i !== item),
            itemsCount: state.itemsCount - item.count,
            totalPrice: state.totalPrice - item.count * item.product.price
          }
        : state;
    }

    case 'clear-cart': {
      return { ...INITIAL };
    }

    case 'update-cart': {
      return {
        ...action.payload,
        updated: true
      };
    }

    default:
      throw new Error(`Unhandled action type ${action.type}`);
  }
}

function CartProvider({ children }) {
  const firstLoad = useRef(true);
  const [state, dispatch] = useReducer(cartReducer, { ...INITIAL });

  useEffect(() => {
    if (firstLoad.current) {
      const cart = JSON.parse(localStorage.getItem('cart'));
      firstLoad.current = false;

      if (cart)
        dispatch({ type: 'update-cart', payload: { ...INITIAL, ...cart } });
    } else {
      if (!state.updated) {
        localStorage.setItem('cart', JSON.stringify(state));
      }
    }
  }, [state]);

  return (
    <CartContext.Provider value={state}>
      <CartDispatchContext.Provider value={dispatch}>
        {children}
      </CartDispatchContext.Provider>
    </CartContext.Provider>
  );
}

function useCartState() {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error('useCartState must be used within a CartProvider');
  }

  return context;
}

function useCartDispatch() {
  const context = useContext(CartDispatchContext);

  if (!context) {
    throw new Error('CartDispatchContext must be used within a CartProvider');
  }

  return context;
}

function useCart() {
  return [useCartState(), useCartDispatch()];
}

export { CartProvider, useCart, useCartState, useCartDispatch };
