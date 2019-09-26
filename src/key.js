export function initKeyEvents(store) {
  document.addEventListener('keyup', event => {
    store.dispatch(
      store.state.controlEditMode ? 'setControlEdit' : 'triggerControlAction',
      {
        type: 'key',
        value: event.key
      }
    );
  });
}
