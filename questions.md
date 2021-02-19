1) **What is the difference between Component and PureComponent? give an
example where it might break my app.**
   
   `PureComponent` provides `shouldComponentUpdate` function which does shallow comparision of props and state
   and skip rerendering component if they are not changed. This is a quite common use case, 
   so React provides `PureComponent` as a ready-to use optimisation feature.
   Caveats here comes from the fact what comparison is shallow.
   
   First, it will not react on deep-level changes, so componen will not be updated when it should,
   and second it will react on props changes even in props value essentially the same but comes from different reference.
   That could happen if new function declared or new object constructed in a parent on each render.
   
   In this case we should write our own `shouldComponentUpdate` and there are probably
   no reason to use `PureComponent`. Another way is to use immutables
               

2) **Context + ShouldComponentUpdate might be dangerous. Can think of
why is that?**
   Every component which uses context is always updated whenever context changes, so if we have `shouldComponentUpdate`
   upper at the components tree, components which 
   use context will be updated regardless if `shouldComponentUpdate` prevented rendering or not, 
   which in some cases could be unexpected behavior
  
 
3) **Describe 3 ways to pass information from a component to its PARENT.**
   * Callback props. Parent provides callback function in a prop and child component call it as a regular
     function whenever is appropriate, passing required info as parameters.
   * Render props. Parent provides callback of special form - function which returns React Elements as 
     a regular render function, that function called in a child with child-specified arguments and use them to render.
     This way parent defines what to render inside a child and child provides parameters to that render. 
     That approach is also knows as slots.
   * Using child ref. Parent can get reference to child instance and read child values directly. While it is not 
     recommended approach it still can be useful in some cases
     
   
4) **Give 2 ways to prevent components from re-rendering.**
    * `shouldComponentUpdate` function. What is does is React remembers result of calling `render` function 
      and if `shouldComponentUpdate` returns *false* on next props or state update, react will skip invoking 
      render again and use result from previous call.
    * `React.memo` HOC helper. in a nutshell it will implement same logic as described above, 
      with a difference it can work with functional components. Tha technique is called memoization.

   
5) **What is a fragment and why do we need it? Give an example where it
might break my app.**
   Fragment is a special element which, when rendered, does not emit any DOM node by itself but instead renders its
   children in place of itself. Most common case is returning Fragment from render function as top-level element with 
   set of children to avoid adding unnecessary container nodes. React allows using arrays for that but syntax is 
   cumbersome, and it will require keys on each element.
   
   Not sure what problem fragments can cause - I never faced one, and struggle to came up with one out of my mind. 
              

6) **Give 3 examples of the HOC pattern.*** `React.memo` noted above is a good one.
   * `AutoCompleteWithData` from that repository is another. It is common technique to move any 
     logic with side effects, like data loading, to HOC, and leave UI component to be dumb and just display whatever
     it receives from props. That separation is also known as smart and dumb components, and HOCs are useful in that approach.
   * `connect` from Redux or `observer` from MobX. Those HOC do all heavy lifting on connecting props to 
     application state and allow keeping component code clean and simple

7) **what's the difference in handling exceptions in promises, callbacks and
async...await.**
   * Callbacks are executed from the code they are passed to, so they dont have any way to handle exceptions raised in
     that code. Common pattern with callbacks is to handle exceptions inside utility code and then invoke callback with 
     an error parameter, or to provide two callbacks - one for success result, and another if there was an error
   * Promises designed in a way what in case of any exception thrown inside promise code 
     (promise constructor, `then`, `catch` or `finally` handlers) promise get rejected and that rejection can be caught by
     `catch` handler. if there is no `catch` handler, no exception is thrown but instead `unhandledrejection` 
     event fired, which can be handled globally, and also can cause a warning in nodejs
   * `async/await` is basically syntactic sugar over the promises and since async function returns a promise, 
     using that promise directly will follow same principles described for promises. But if promise is 'unboxed' 
     with await, exception is get thrown in case of promise rejected. That exception should be catched with `try/catch` block
     
```javascript
   async function f() {}
   const x = f()
   //x is regular Promise so we can do
   x.catch(err=> {})
   // that also mean what if inside f() there is exception is thrown, 
   // that promise gets rejected, instead of propagating exception up through the callstack.
   
   or we can use await to get value or exception from that promise:
   try  {
   //this will throw if promise rejected (which in turn will be rejected in case of exception thrown inside f())
   // bascially that means that sequence: 'exception thrown => promise rejected => await throws exception again'
    const x = await f() 
   } catch (err) {
   }
   
   //we also can await on regular promises, catching it's rejects as exceptions:
   const p = Promise.resolve().then(() => {throw 'Error'})
   try {
      const x = await p
   } catch (e) {
      //here we catch our error thrown in 'then' 
   } 
    
```
   
8) **How many arguments does setState take and why is it async.**
  It takes one to two arguments, first can be state update object, or state update function,
  and second argument is callback which executed after state update is applied. It is async because React can defer 
  actual updates of components state to batch them and optimize rendering.
      

9) **List the steps needed to migrate a Class to Function Component.**
    * Move code from render function to functional component
    * Convert component state itself and `setState` calls to using `useState` hook
    * Move any class instance fields to local variables
    * Move all logic from component lifecycle methods to one or more `useEffect` hooks
    * if component has `shouldComponentUpdate` method, wrap functional component with React.memo HOC
    * Move all handlers to be plain functions inside functional component
    * change any remaining occurence of `this` usage to appropriate alternative
    Order of those steps is not really important
         

10) **List a few ways styles can be used with components.**
    * Applying styles directly with `style` prop
    * Use css/sass files, so they added to the bundle and using `className` to specify class for a component. 
      This could lead to css name conflicts which can be solved different ways, for example, using BEM methodology
    * Using css modules. This makes styles in one file isolated from antoher file so class names can be used more 
      freely and without need to unsure uniquiness
    * There are some libraries which take css code as literal templates and generate either value for a `style` prop, or
      component with those styles applied. One example is `styled-components`
    * There are also some utility libraries like `classnames` which makes it easier to work with multiple classnames.
        

11) **How to render an HTML string coming from the server.**
    There is a special prop `dangerouslySetInnerHtml`, which allows to directly set `innerHTML` value for a dom node.
    That is worth to note rendering html coming from the server should be avoided, as it opens XSS attack posibility
    which could be hard to mitigate and require additional security measures.
    