export const between = (val: number, min: number, max: number): number => Math.max(min, Math.min(val, max));
  
/**
 * Gère le scaling a appliqué en fonction de la distance
 */
export const scaling = (d: number) => between(-0.2 * Math.pow(d, 2) + 1.05, 0, 1);
  
export const TransformOrigins: Record<Direction, string> = {
    "-1": "right",
    0: "center",
    1: "left"
};

// export const Direction = {
//     None: 0,
//     Right: -1,
//     Left: 1
// }
export enum Direction {
    None = 0,
    Right = -1,
    Left = 1
}

export class Dock {
    scale = 1;
    root: HTMLElement;
    icons: HTMLElement[];
    iconSize?: number;
    mousePosition?: number

    constructor(el: HTMLElement) {
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

    handleMouseMove(e: MouseEvent) {
        this.mousePosition = between(
            (e.clientX - this.root.offsetLeft) / this.iconSize!,
            0,
            this.icons.length
        );
        this.scaleIcons();
    }

    /**
     * Applique la transformation sur les icons
     */
    scaleIcons() {
        const selectedIndex = Math.floor(this.mousePosition!);
        const centerOffset = this.mousePosition! - selectedIndex - 0.5;
        const baseOffset = this.scaleFromDirection(
            selectedIndex,
            Direction.None,
            -centerOffset * this.iconSize!
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

    scaleFromDirection(index: number, direction: Direction, offset: number) {
        const center = index + 0.5;
        const distanceFromPointer = this.mousePosition! - center;
        const scale = scaling(distanceFromPointer) * this.scale;
        const icon = this.icons[index];
        icon?.style.setProperty(
            "transform",
            `translateX(${offset}px) scale(${scale + 1})`
        );
        icon?.style.setProperty(
            "transform-origin",
            `${TransformOrigins[direction.toString() as unknown as Direction]} bottom`
        );
        return scale * this.iconSize!;
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