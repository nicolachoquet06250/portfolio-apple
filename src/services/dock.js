/**
 * @param {number} val
 * @param {number} min
 * @param {number} max
 * @return {number}
 */
export const between = (val, min, max) => Math.max(min, Math.min(val, max));
  
/**
 * Gère le scaling a appliqué en fonction de la distance
 * @param {number} d
 */
export const scaling = d => between(-0.2 * Math.pow(d, 2) + 1.05, 0, 1);
  
export const TransformOrigins = {
    "-1": "right",
    0: "center",
    1: "left"
};

export const Direction = {
    None: 0,
    Right: -1,
    Left: 1
}

/**
 * @property {HTMLElement} root
 * @property {HTMLElement[]} icons
 * @property {number} inconSize
 * @property {number} mousePosition
 */
export class Dock {
    scale = 1;
  
    /**
     * @param {HTMLElement} el
     */
    constructor(el) {
        this.root = el;
        this.icons = Array.from(el.querySelectorAll('.dock-icon'));
        if (this.icons.length === 0) {
            return;
        }
        this.iconSize = this.icons[0].offsetWidth;
        el.addEventListener("mousemove", this.handleMouseMove.bind(this));
        el.addEventListener("mouseleave", this.handleMouseLeave.bind(this));
        el.addEventListener("mouseenter", this.handleMouseEnter.bind(this));
    }
  
    /**
     * @param {MouseEvent} e
     */
    handleMouseMove(e) {
        this.mousePosition = between(
            (e.clientX - this.root.offsetLeft) / this.iconSize,
            0,
            this.icons.length
        );
        this.scaleIcons();
    }
  
    /**
     * Applique la transformation sur les icons
     */
    scaleIcons() {
        const selectedIndex = Math.floor(this.mousePosition);
        const centerOffset = this.mousePosition - selectedIndex - 0.5;
        const baseOffset = this.scaleFromDirection(
            selectedIndex,
            Direction.None,
            -centerOffset * this.iconSize
        );
        let offset = baseOffset * (0.5 - centerOffset);
        for (let i = selectedIndex + 1; i < this.icons.length; i++) {
            offset += this.scaleFromDirection(i, Direction.Left, offset);
        }
        offset = baseOffset * (0.5 + centerOffset);
        for (let i = selectedIndex - 1; i >= 0; i--) {
            offset += this.scaleFromDirection(i, Direction.Right, -offset);
        }
    }
  
    /**
     * @param {number} index Index de l'icône à agrandir
     * @param {number} direction Position de l'icône (0: centre, -1: gauche, 1: droite)
     * @param {number} offset
     */
    scaleFromDirection(index, direction, offset) {
        const center = index + 0.5;
        const distanceFromPointer = this.mousePosition - center;
        const scale = scaling(distanceFromPointer) * this.scale;
        const icon = this.icons[index];
        icon?.style.setProperty(
            "transform",
            `translateX(${offset}px) scale(${scale + 1})`
        );
        icon?.style.setProperty(
            "transform-origin",
            `${TransformOrigins[direction.toString()]} bottom`
        );
        return scale * this.iconSize;
    }
  
    handleMouseLeave() {
        this.root.classList.add("animated");
        this.icons.forEach((icon) => {
            icon.style.removeProperty("transform");
            icon.style.removeProperty("transform-origin");
        });
    }
  
    handleMouseEnter() {
        this.root.classList.add("animated");
        setTimeout(() => {
            this.root.classList.remove("animated");
        }, 100);
    }
}