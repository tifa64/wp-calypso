/** @format */

/**
 * External dependencies
 */
//import every from 'lodash/every';
//import filter from 'lodash/filter';

/**
 * WordPress dependencies
 */
import { __ } from '@wordpress/i18n';
import classnames from 'classnames';
import { registerBlockType } from '@wordpress/blocks';
// import { createBlock, registerBlockType } from '@wordpress/blocks';
import { RichText } from '@wordpress/editor';
// import { RichText, mediaUpload } from '@wordpress/editor';
// import { createBlobURL } from '@wordpress/blob';

/**
 * Internal dependencies
 */
import './editor.scss';
import { default as edit, defaultColumnsNumber } from './edit';

const blockAttributes = {
	images: {
		type: 'array',
		default: [],
		source: 'query',
		selector: 'ul.wp-block-a8c-tiled-gallery .wp-block-a8c-tiled-gallery__item',
		query: {
			url: {
				source: 'attribute',
				selector: 'img',
				attribute: 'src',
			},
			link: {
				source: 'attribute',
				selector: 'img',
				attribute: 'data-link',
			},
			alt: {
				source: 'attribute',
				selector: 'img',
				attribute: 'alt',
				default: '',
			},
			id: {
				source: 'attribute',
				selector: 'img',
				attribute: 'data-id',
			},
			caption: {
				type: 'array',
				source: 'children',
				selector: 'figcaption',
			},
		},
	},
	columns: {
		type: 'number',
	},
	imageCrop: {
		type: 'boolean',
		default: true,
	},
	layout: {
		type: 'string',
		default: 'rectangular',
	},
	linkTo: {
		type: 'string',
		default: 'none',
	},
};

const blockName = 'a8c/tiled-gallery';

const blockSettings = {
	title: __( 'Tiled gallery' ),
	description: __( 'Display multiple images in an elegantly organized tiled layout.' ),
	icon: 'format-gallery',
	category: 'jetpack',
	keywords: [ __( 'images' ), __( 'photos' ), __( 'masonry' ) ],
	attributes: blockAttributes,
	supports: {
		align: true,
	},

	/*
	transforms: {
		from: [
			{
				type: 'block',
				isMultiBlock: true,
				blocks: [ 'core/gallery' ],
				transform: ( attributes ) => {
					const validImages = filter( attributes, ( { id, url } ) => id && url );
					if ( validImages.length > 0 ) {
						return createBlock( 'core/gallery', {
							images: validImages.map( ( { id, url, alt, caption } ) => ( { id, url, alt, caption } ) ),
						} );
					}
					return createBlock( 'core/gallery' );
				},
			},
			{
				type: 'shortcode',
				tag: 'gallery',
				attributes: {
					images: {
						type: 'array',
						shortcode: ( { named: { ids } } ) => {
							if ( ! ids ) {
								return [];
							}

							return ids.split( ',' ).map( ( id ) => ( {
								id: parseInt( id, 10 ),
							} ) );
						},
					},
					columns: {
						type: 'number',
						shortcode: ( { named: { columns = '3' } } ) => {
							return parseInt( columns, 10 );
						},
					},
					linkTo: {
						type: 'string',
						shortcode: ( { named: { link = 'attachment' } } ) => {
							return link === 'file' ? 'media' : link;
						},
					},
				},
			},
			{
				// When created by drag and dropping multiple files on an insertion point
				type: 'files',
				isMatch( files ) {
					return files.length !== 1 && every( files, ( file ) => file.type.indexOf( 'image/' ) === 0 );
				},
				transform( files, onChange ) {
					const block = createBlock( 'core/gallery', {
						images: files.map( ( file ) => ( { url: createBlobURL( file ) } ) ),
					} );
					mediaUpload( {
						filesList: files,
						onFileChange: ( images ) => onChange( block.clientId, { images } ),
						allowedType: 'image',
					} );
					return block;
				},
			},
		],
		to: [
			{
				type: 'block',
				blocks: [ 'core/image' ],
				transform: ( { images } ) => {
					if ( images.length > 0 ) {
						return images.map( ( { id, url, alt, caption } ) => createBlock( 'core/image', { id, url, alt, caption } ) );
					}
					return createBlock( 'core/image' );
				},
			},
		],
	},
	*/

	edit,

	save( { attributes, className } ) {
		const { images, columns = defaultColumnsNumber( attributes ), imageCrop, linkTo } = attributes;
		return (
			<ul
				className={ classnames( className, `columns-${ columns }`, {
					'is-cropped': imageCrop,
				} ) }
			>
				{ images.map( image => {
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
						<li key={ image.id || image.url } className={ `${ className }__item` }>
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
	},
};

registerBlockType( blockName, blockSettings );
