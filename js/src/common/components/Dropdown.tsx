import Component, {ComponentProps} from '../Component';
import icon from '../helpers/icon';
import listItems from '../helpers/listItems';

export interface DropdownProps extends ComponentProps {
  buttonClassName?: string;
  menuClassName?: string;
  label?: string;
  icon?: string;
  caretIcon?: undefined|string;

  onhide?: Function;
  onshow?: Function;
  onclick?: Function;
}

/**
 * The `Dropdown` component displays a button which, when clicked, shows a
 * dropdown menu beneath it.
 *
 * ### Props
 *
 * - `buttonClassName` A class name to apply to the dropdown toggle button.
 * - `menuClassName` A class name to apply to the dropdown menu.
 * - `icon` The name of an icon to show in the dropdown toggle button.
 * - `caretIcon` The name of an icon to show on the right of the button.
 * - `label` The label of the dropdown toggle button. Defaults to 'Controls'.
 * - `onhide`
 * - `onshow`
 *
 * The children will be displayed as a list inside of the dropdown menu.
 */
export default class Dropdown<T extends DropdownProps = DropdownProps> extends Component<T> {
  showing: boolean;

  static initProps(props: DropdownProps) {
    props.className = props.className || '';
    props.buttonClassName = props.buttonClassName || '';
    props.menuClassName = props.menuClassName || '';
    props.label = props.label || '';
    props.caretIcon = typeof props.caretIcon !== 'undefined' ? props.caretIcon : 'fas fa-caret-down';
  }

  view() {
    const items = this.props.children ? listItems(this.props.children) : [];

    return (
      <div className={`ButtonGroup Dropdown dropdown ${this.props.className} itemCount${items.length}${this.showing ? ' open' : ''}`}>
        {this.getButton()}
        {this.getMenu(items)}
      </div>
    );
  }

  oncreate(vnode) {
    super.oncreate(vnode);

    this.$('> .Dropdown-toggle').dropdown();

    // When opening the dropdown menu, work out if the menu goes beyond the
    // bottom of the viewport. If it does, we will apply class to make it show
    // above the toggle button instead of below it.
    this.element.addEventListener('shown.bs.dropdown', () => {
      this.showing = true;

      if (this.props.onshow) {
        this.props.onshow();
      }

      m.redraw();

      const $menu = this.$('.Dropdown-menu');
      const isRight = $menu.hasClass('Dropdown-menu--right');

      $menu.removeClass('Dropdown-menu--top Dropdown-menu--right');

      $menu.toggleClass(
        'Dropdown-menu--top',
        $menu.offset().top + $menu.height() > $(window).scrollTop() + $(window).height()
      );

      if ($menu.offset().top < 0) {
        $menu.removeClass('Dropdown-menu--top');
      }

      $menu.toggleClass(
        'Dropdown-menu--right',
        isRight || $menu.offset().left + $menu.width() > $(window).scrollLeft() + $(window).width()
      );
    });

    this.element.addEventListener('hidden.bs.dropdown', () => {
      this.showing = false;

      if (this.props.onhide) {
        this.props.onhide();
      }

      m.redraw();
    });
  }

  /**
   * Get the template for the button.
   */
  protected getButton(): any {
    return (
      <button
        className={'Dropdown-toggle ' + this.props.buttonClassName}
        data-toggle="dropdown"
        onclick={this.props.onclick}>
        {this.getButtonContent()}
      </button>
    );
  }

  /**
   * Get the template for the button's content.
   *
   * @return {*}
   */
  protected getButtonContent() {
    const attrs = this.props;

    return [
      attrs.icon ? icon(attrs.icon, {className: 'Button-icon'}) : '',
      <span className="Button-label">{attrs.label}</span>,
      attrs.caretIcon ? icon(attrs.caretIcon, {className: 'Button-caret'}) : ''
    ];
  }

  protected getMenu(items) {
    return (
      <ul className={'Dropdown-menu dropdown-menu ' + this.props.menuClassName}>
        {items}
      </ul>
    );
  }
}
