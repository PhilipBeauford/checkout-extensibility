import React from 'react';
import {
  useExtensionApi,
  render,
  Banner,
  View,
  InlineLayout,
  Text,
  Disclosure,
  Pressable,
  Icon,
  BlockStack,
  TextBlock,
  Button,
} from '@shopify/checkout-ui-extensions-react';

render('Checkout::Dynamic::Render', () => <App />);

function App() {
  const {extensionPoint} = useExtensionApi();  

  return (
    <View title="govx-react" maxInlineSize= 'fill' cornerRadius= 'large' border= 'base'>
		<BlockStack spacing='none'>
			<Disclosure>
				<Pressable toggles= 'one' padding= 'base'>
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
				</View>
			</Disclosure>
		</BlockStack>
    </View>
  );
}