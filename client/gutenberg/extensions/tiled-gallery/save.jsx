/** @format */

/**
 * External dependencies
 */
import { RichText } from '@wordpress/editor';
import classnames from 'classnames';

/**
 * Internal dependencies
 */
import { defaultColumnsNumber } from './edit';

export default ( { attributes, className } ) => {
	const {
		images,
		columns,
		layout = defaultColumnsNumber( attributes ),
		imageCrop,
		linkTo,
	} = attributes;
	return (
		<ul
			className={ classnames( className, `layout-${ layout }`, `columns-${ columns }`, {
				'is-cropped': imageCrop,
			} ) }
		>
			{ images.map( ( image, index ) => {
				let href;

				switch ( linkTo ) {
					case 'media':
						href = image.url;
						break;
					case 'attachment':
						href = image.link;
						break;
				}

				const img = (
					<img
						src={ image.url }
						alt={ image.alt }
						data-id={ image.id }
						data-link={ image.link }
						className={ classnames( {
							[ `wp-image-${ image.id }` ]: image.id,
						} ) }
					/>
				);

				return (
					<li
						key={ image.id || image.url }
						className={ `${ className }__item ${ className }__item-${ index }` }
					>
						<figure>
							{ href ? <a href={ href }>{ img }</a> : img }
							{ image.caption &&
								image.caption.length > 0 && (
									<RichText.Content tagName="figcaption" value={ image.caption } />
								) }
						</figure>
					</li>
				);
			} ) }
		</ul>
	);
};
