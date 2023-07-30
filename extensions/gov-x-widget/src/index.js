import {
	extend,
	View,
	InlineLayout,
	Text,
	Disclosure,
	Pressable,
	Icon,
	BlockStack,
	TextBlock,
	Button,
} from '@shopify/checkout-ui-extensions';


extend('Checkout::Dynamic::Render', (root, { lines, applyCartLinesChange, query, i18n }) => {

	const disclosure = root.createComponent(Disclosure,{},
	[
		root.createComponent(
			Pressable, {padding: 'base', toggles: 'one'},
			[
				root.createComponent(InlineLayout, {columns: ['fill', 'auto'], blockAlignment: {alignment: 'center'}}, 
				[
					root.createComponent(Text, {}, 'GovX Discount'),
					root.createComponent(Icon, {source: 'chevronDown', size: 'base'}),
				]),
			]
		),
		root.createComponent(
		View, 
		{ 
			id: 'one', 
			padding: ['small200', 'base', 'base', 'base'],
		},
			root.createComponent(
				BlockStack,
				{},
				[
					root.createComponent( TextBlock,{size: 'base'},
						'Lorem Ipsum paragraph',
					),
	
					root.createComponent(
						Button,
						{
							to: 'https://auth.govx.com/shopify/verify?shop=thread-llc.myshopify.com&utm_source=shopify&utm_medium=govxid&utm_campaign=custom_link'
						},
						"Verify ID",
					)
				]	
			),
		),
	]);

	const containerApp = 
	root.createComponent(
		View,
		{
			maxInlineSize: 'fill',
			cornerRadius: 'large',
			border: 'base',
		},
		[
			root.createComponent(
			BlockStack, {spacing: 'none',},
			[disclosure,],
			),
		],
	);

	root.appendChild(containerApp);
});