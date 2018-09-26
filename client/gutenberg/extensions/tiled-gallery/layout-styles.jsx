/** @format */

/**
 * External Dependencies
 */
import { Component } from '@wordpress/element';
import { select } from '@wordpress/data';

/**
 * Internal dependencies
 */
import { rectangularLayout, squareLayout, circleLayout, columnsLayout } from './layouts';

class LayoutStyles extends Component {
	render() {
		const { className, columns, images, layout, margin } = this.props;

		if ( ! images.length ) {
			return null;
		}

		const { getEditorSettings } = select( 'core/editor' );
		const editorSettings = getEditorSettings();
		const layoutOptions = {
			columns,
			maxWidth: editorSettings.maxWidth,
			images,
			margin,
		};
		let rows = [];

		switch ( layout ) {
			case 'rectangular':
				rows = rectangularLayout( layoutOptions );
				break;
			case 'square':
				rows = squareLayout( layoutOptions );
				break;
			case 'circle':
				rows = circleLayout( layoutOptions );
				break;
			case 'columns':
				rows = columnsLayout( layoutOptions );
		}

		let styles = '';
		let nth = 0;

		rows.forEach( row => {
			styles += row.images
				.map( image => {
					// Alternatively:
					// .${ className } img[data-id="${ image.id }"] {
					// .${ className } .blocks-gallery-item:nth-child(${ nth++ }) {
					// @TODO media-queries
					return `
					.${ className }__item-${ nth++ } {
						width: ${ image.width }px;
						height: ${ image.height }px;
					}
				`;
				} )
				.join( '' );
		} );

		// eslint-disable-next-line react/no-danger
		return <style dangerouslySetInnerHTML={ { __html: styles } } />;
	}
}

export default LayoutStyles;
