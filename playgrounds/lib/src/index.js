import { HTMLWebWidgetElement, WebWidgetDependencies } from '@web-widget/container';
import '@web-widget/system-loader';
import '@growing-web/web-router';

function defineHook(target, name, callback) {
  return Reflect.defineProperty(
    target,
    name,
    callback(Reflect.getOwnPropertyDescriptor(target, name))
  );
}

function isRouterApp (widget) {
  return [...document.querySelectorAll('web-router')]
  .some(router => router.contains(widget));
};

function getRootAppData() {
  const element = document.querySelector('script[type="application/sd+json"]')
  if (element) {
    try {
      return JSON.parse(element.textContent);
    } catch (error) { }
  }
  return null;
};

// defineHook(HTMLWebWidgetElement.prototype, 'createDependencies', ({ value }) => ({
//   value() {
//     const dependencies = value.apply(this, arguments);
//     defineHook(dependencies, 'router', () => ({
//       get: () => this.router
//     }));
//     defineHook(dependencies, 'route', () => ({
//       get: () => this.route
//     }));
//     return dependencies;
//   }
// }));

defineHook(WebWidgetDependencies.prototype, 'data', ({ get }) => {
  return {
    get() {
      const data = get.apply(this, arguments);
      if (isRouterApp(this.ownerElement)) {
        const rootAppData = getRootAppData();
        return { ...rootAppData, ...data };
      }
      return data;
    }
  }
});
