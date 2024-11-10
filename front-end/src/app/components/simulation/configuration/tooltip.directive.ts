import { Directive, ElementRef, Input, HostListener, Renderer2 } from '@angular/core';

@Directive({
  standalone: true,
  selector: '[appTooltip]'
})
export class TooltipDirective {
  @Input('appTooltip') tooltipText = '';  // Tooltip text from input
  tooltipElement: HTMLDivElement | null = null;

  constructor(private el: ElementRef, private renderer: Renderer2) {}

  @HostListener('mouseenter') onMouseEnter() {
    if (!this.tooltipElement) {
      this.showTooltip();
    }
  }

  @HostListener('mouseleave') onMouseLeave() {
    this.hideTooltip();
  }

  showTooltip() {
    this.tooltipElement = this.renderer.createElement('div');
    this.renderer.appendChild(
      this.tooltipElement,
      this.renderer.createText(this.tooltipText)
    );

    this.renderer.addClass(this.tooltipElement, 'tooltip-box');
    this.renderer.appendChild(this.el.nativeElement, this.tooltipElement);
  }

  hideTooltip() {
    if (this.tooltipElement) {
      this.renderer.removeChild(this.el.nativeElement, this.tooltipElement);
      this.tooltipElement = null;
    }
  }
}
