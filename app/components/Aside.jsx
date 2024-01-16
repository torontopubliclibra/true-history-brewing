import arrowRight from './../../public/assets/icons/arrow-right.svg';

/**
 * A side bar component with Overlay that works without JavaScript.
 * @example
 * ```jsx
 * <Aside id="search-aside" heading="SEARCH">
 *  <input type="search" />
 *  ...
 * </Aside>
 * ```
 * @param {{
 *   children?: React.ReactNode;
 *   heading: React.ReactNode;
 *   id?: string;
 * }}
 */
export function Aside({children, heading, id = 'aside', updateAsideOpen}) {
  return (
    <div aria-modal className="overlay" id={id} role="dialog">
      <button
        className="close-outside"
        onClick={() => {
          updateAsideOpen("", false);
        }}
      />
      <aside>
        <header>
          <CloseAside updateAsideOpen={updateAsideOpen} />
          <h3>{heading}</h3>
        </header>
        <main>{children}</main>
      </aside>
    </div>
  );
}

function CloseAside({updateAsideOpen}) {

  return (
    /* eslint-disable-next-line jsx-a11y/anchor-is-valid */
    <a
      className="close"
      onClick={
        () => updateAsideOpen("", false)}>
      <img src={arrowRight} className="button-icon" />
    </a>
  );
}
