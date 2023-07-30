import React from 'react';
import {
  useExtensionApi,
  render,
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
  useTranslate,
} from '@shopify/checkout-ui-extensions-react';

render('Checkout::Dynamic::Render', () => <App />);

function App() {
  const {extensionPoint} = useExtensionApi();
  
  const checkChange = async () => {
							
	// If checkbox is checked, add a bottom border & update props
	if( checkDrop.children[0].children[1].children[0].props.checked == "") {
		checkDrop.updateProps({ border: ['none', 'none', 'base', 'none']});
		checkDrop.children[0].children[1].children[0].updateProps( {checked: "false"});

		// Auto add to cart $2 donation
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
		})

		//Remove added donations/cart lines
		filteredArray.forEach(async donation => {
			const removeLines = await applyCartLinesChange({
				type: "removeCartLine",
				id: donation.id, // Needs reliable line item id number
				quantity: donation.quantity,
			});
		})
	}
	};
  
  return (
    <View maxInlineSize= 'fill' cornerRadius= 'large' border= 'base'>
		<BlockStack spacing='none'>
			<Disclosure 
				open='false' 
				toggles='one'>
				
				<InlineLayout 
					blockAlignment= 'center'
					spacing= 'base'
					columns= {['auto', 'fill']}
					padding= 'loose'
					border= {['none', 'none', 'none', 'none']}>
					<BlockStack>
						<Image source= 'https://cdn.shopify.com/s/files/1/0728/3494/1235/files/logo_3.svg?v=1690579006'></Image>
						<InlineLayout 
							blockAlignment= 'center'
							spacing= 'base'
							columns= {['auto', 'fill']}
							padding= 'none'
							border= {['none', 'none', 'none', 'none']}>
							<Checkbox toggles= "one"
							checked= ""
							onChange= {checkChange}>$2- Show your support for the Carry On Foundation.</Checkbox>
						</InlineLayout>
					</BlockStack>
				</InlineLayout>
				
				
				
				<View>
					<Form>
						<BlockStack>
							<InlineLayout>
								<Button></Button>
								<Button></Button>
								<Button></Button>
							</InlineLayout>
							
							<InlineLayout>
								<Select 
									label= 'Donation amount'
									value= '2'
									id= 'donate-select'
									options= 
									{[
										{
											value: '1',
											label: '$1',
										},
										{
											value: '2',
											label: '$2',
										},
										{
											value: '3',
											label: '$3',
										},
										{
											value: '4',
											label: '$4',
										},
										{
											value: '5',
											label: '$5',
										},
										{
											value: '6',
											label: '$6',
										},
										{
											value: '7',
											label: '$7',
										},
										{
											value: '8',
											label: '$8',
										},
										{
											value: '9',
											label: '$9',
										},
										{
											value: '10',
											label: '$10',
										},
									]}
									onChange={(value) => { selector.updateProps({value: parseInt(value)})} />
									
								<View>
									<Button>Update</Button>
								</View>
							</InlineLayout>
							
							<Text>'Our Mission: Teach youth resilience skills and promote mental health through action sports and outdoor recreation.'</Text>
						</BlockStack>
					</Form>
				</View>
				
				
				
				
				
				
				
				
				
				
				{/* <Pressable toggles= 'one' padding= 'base'>
					<InlineLayout columns={['fill', 'auto']}>
						<Text>
							GovX Discount
						</Text>
						<Icon source= 'chevronDown' size= 'base'></Icon>
					</InlineLayout>
				</Pressable>
				
				<View id= 'one' padding= {['small200', 'base', 'base', 'base']}>
					<BlockStack>
						<TextBlock size= 'base'>
							Lorem Ipsum Paragraph
						</TextBlock>
						<Button to= 'https://auth.govx.com/shopify/verify?shop=thread-llc.myshopify.com&utm_source=shopify&utm_medium=govxid&utm_campaign=custom_link'>
							Verify ID
						</Button>
					</BlockStack>
				</View> */}
				
				
			</Disclosure>
		</BlockStack>
    </View>
  );
}