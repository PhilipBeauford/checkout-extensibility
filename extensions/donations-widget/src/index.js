import {
	extend,
	BlockStack,
	View,
	InlineLayout,
	Image,
	Text,
	Form,
	Button,
	Disclosure,
	Checkbox,
	Select,
	Banner,
	Style,
} from '@shopify/checkout-ui-extensions';


extend('Checkout::Dynamic::Render', (root, { lines, applyCartLinesChange, query, i18n }) => {
	const openIds = ['one'];
	
	//Manually subscribe to changes to cart lines.
	lines.subscribe(async(value) => {
		if(value) {
									
			let secondArray = [];
			console.log('empty array', secondArray);
			
			
			// Grab lines objects only if title matches
			lines.current.forEach(lineObj => {
				if(lineObj.merchandise.title == 'The One Dollar Donation') {
					secondArray.push(lineObj);
				}
				console.log('lineObjECTS-DOS?', lineObj);
			})

			console.log('obj filter DOS?', secondArray);
			console.log('linesCurrent? DOS', lines.current);

			

			if(secondArray[0].quantity > 2 && selector.props.value != secondArray[0].quantity) {
				// Remove added donations/cart lines (need line item id)
				console.log('secondArray', secondArray.id, secondArray[0].id);

					const result2 = await applyCartLinesChange({
						type: "removeCartLine",
						id: secondArray[0].id, // Need reliable line item id number
						quantity: secondArray[0].quantity - selector.props.value,
					});
					
					console.log('removal result', result2);
				
			}

		}
		
		console.log('lines changed', lines);
	});




	const checkDrop = root.createComponent(
		InlineLayout,
		{
			blockAlignment: 'center',
			spacing: 'base',
			columns: ['auto', 'fill'],
			padding: 'loose',
			border: ['none', 'none', 'none', 'none'],
		},
		[
			root.createComponent(BlockStack, {},
			[

				root.createComponent(Image, {
					source: "https://cdn.shopify.com/s/files/1/0728/3494/1235/files/output-onlinepngtools_4.png?v=1690317987",
				}),

				root.createComponent(InlineLayout, 
					{
						blockAlignment: 'center',
						spacing: 'base',
						columns: ['auto', 'fill'],
						padding: 'none',
						border: ['none', 'none', 'none', 'none'],
					},
					[

						root.createComponent(Checkbox, {
							toggles: "one",
							checked: "",
							onChange: async () => {
							
							// If checkbox is NOT checked, add a bottom border & update props
							if( checkDrop.children[0].children[1].children[0].props.checked == "") {
								checkDrop.updateProps({ border: ['none', 'none', 'base', 'none']});
								checkDrop.children[0].children[1].children[0].updateProps( {checked: "false"});

								console.log('checkbox was just checked?', checkDrop.children[0].children[1].children[0].props.checked);

								// Add to cart $2 auto donation, apply the cart lines change
								const result = await applyCartLinesChange({
									type: "addCartLine",
									merchandiseId: 'gid://shopify/ProductVariant/45393245176115',
									quantity: 2,
								});

									if (result.type === "error") {
									// An error occurred adding the cart line
									// Verify that you're using a valid product variant ID
									// For example, 'gid://shopify/ProductVariant/123'
									console.error('error', result.message);
									const errorComponent = root.createComponent(
										Banner,
										{ status: "critical" },
										["There was an issue adding this product. Please try again."]
									);
									// Render an error Banner as a child of the top-level app component for three seconds, then remove it
									const topLevelComponent = root.children[0];
									topLevelComponent.appendChild(errorComponent);
									setTimeout(
										() => topLevelComponent.removeChild(errorComponent),
										3000
									);
								}
								
							} else if(checkDrop.children[0].children[1].children[0].props.checked == 'false') {
								checkDrop.updateProps({ border: ['none', 'none', 'none', 'none']});
								checkDrop.children[0].children[1].children[0].updateProps( {checked: ""})

								let filteredArray = [];

								// Grab lines objects only if title matches
								lines.current.forEach(lineObj => {
									if(lineObj.merchandise.title == 'The One Dollar Donation') {
										filteredArray.push(lineObj);
									}
									console.log('lineObj?', lineObj);
								})

								console.log('obj filter worked?', filteredArray);
								console.log('linesCurrent?', lines.current);

								//Remove added donations/cart lines (need line item id)
								filteredArray.forEach(async donation => {
									const removeLines = await applyCartLinesChange({
										type: "removeCartLine",
										id: donation.id, // Need reliable line item id number
										quantity: donation.quantity,
									});
								})
							}
							}
						}),
						'$2- Show your support for the Carry On Foundation.',
					]
				),
			])
		],
	);


	const selector = 	root.createComponent(Select, {
		label: 'Donation amount',
		value: 2,
		id: 'donate-select',
		options: 
		[
			{
				value: 1,
				label: '$1',
			},
			{
				value: 2,
				label: '$2',
			},
			{
				value: 3,
				label: '$3',
			},
			{
				value: 4,
				label: '$4',
			},
			{
				value: 5,
				label: '$5',
			},
			{
				value: 6,
				label: '$6',
			},
			{
				value: 7,
				label: '$7',
			},
			{
				value: 8,
				label: '$8',
			},
			{
				value: 9,
				label: '$9',
			},
			{
				value: 10,
				label: '$10',
			},
		],
		onChange: (value) => { selector.updateProps({value: parseInt(value)}); }
	})


	// Form inner
	const disclosureView = root.createComponent(
	View,
	{
		id: "one",
		padding: ['base', 'base', 'base', 'base'],
	},
	[
		root.createComponent(
		Form,
		{
			onSubmit: () =>
			console.log('onSubmit event'),
		},
		[

			root.createComponent(BlockStack, {}, [
				root.createComponent(
					InlineLayout,
					{
					columns: ['fill', 'fill'],
					spacing: 'none',
					},
					[

					root.createComponent(Button, {
						kind: 'secondary',
						id: 'Button2',
						// appearance: Style.when({hover: true}, 'accent'),
						onPress: () => {
							selector.updateProps({ value: 2 });
						}
					}, '$2'),

					root.createComponent(Button, {
						kind: 'secondary',
						id: 'Button5',
						onPress: () => {
							selector.updateProps({ value: 5 });
						}
					}, '$5'),

					root.createComponent(Button, {
						kind: 'secondary',
						id: 'Button10',
						onPress: () => {
							selector.updateProps({ value: 10 });
						}
					}, '$10'),

					],
				),

				root.createComponent(
					InlineLayout,
					{
					columns: ['fill', 'auto'],
					spacing: 'base',
					},
					[
						selector,

						root.createComponent(View, {}, [
							root.createComponent(
							Button,
							{
								accessibilityRole: 'submit',
								kind: 'primary',
								onPress: async () => {
									
											
										// Apply the cart lines change
										const result = await applyCartLinesChange({
											type: "addCartLine",
											merchandiseId: 'gid://shopify/ProductVariant/45393245176115',
											quantity: parseInt(selector.props.value),
										});
										
										console.log('result', result);
	
										if (result.type === "error") {
											// An error occurred adding the cart line
											// Verify that you're using a valid product variant ID
											// For example, 'gid://shopify/ProductVariant/123'
											console.error('error', result.message);
											const errorComponent = root.createComponent(
												Banner,
												{ status: "critical" },
												["There was an issue adding this product. Please try again."]
											);
											// Render an error Banner as a child of the top-level app component for three seconds, then remove it
											const topLevelComponent = root.children[0];
											topLevelComponent.appendChild(errorComponent);
											setTimeout(
												() => topLevelComponent.removeChild(errorComponent),
												3000
											);
										}
									

								},
							},
							'Update',
							),
						]),
					],
				),

				root.createComponent(
					Text,
					{
						size: 'base'
					},
					'Our Mission: Teach youth resilience skills and promote mental health through action sports and outdoor recreation.'
				)
			]),
		],
		),
	],
	);


	// disclosure is a drop-down container
	// both checkbox 'div' & entire disclosureView are rendered by this one disclosure/dropdown
	const donationWidget = root.createComponent(
	Disclosure,
	{
		open: 'false',
		onToggle: (open) => {
			if (donationWidget.props.open == "false") {
				donationWidget.updateProps({open: 'one'})
			} else {
				donationWidget.updateProps({open: 'false'})
			}
		}
	},
	[checkDrop, disclosureView],
	);


	// Main app that contains the donation widget.. which contains all fields, wrapped as one 'box' using border
	const donationsContainer = root.createComponent(
	View,
	{
		maxInlineSize: 'fill',
		cornerRadius: 'large',
		border: 'base',
	},
	[
		root.createComponent(
		BlockStack,
		{
			spacing: 'none',
		},
		[
			donationWidget,
		],
		),
	],
	);

	root.appendChild(donationsContainer);
});