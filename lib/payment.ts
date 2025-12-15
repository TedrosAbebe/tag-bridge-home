import { paymentOperations, propertyOperations, settingsOperations } from './database'

export interface PaymentInfo {
  id: string
  propertyId: string
  userId: string
  amount: number
  paymentType: 'rent_listing' | 'sale_listing'
  status: 'pending' | 'confirmed' | 'rejected'
  bankAccountPlaceholder: string
  whatsappContactPlaceholder: string
}

export function getListingFees() {
  const rentFee = (settingsOperations.get.get('rent_listing_fee') as any)?.value || '25'
  const saleFee = (settingsOperations.get.get('sale_listing_fee') as any)?.value || '50'
  
  return {
    rent_listing: parseFloat(rentFee),
    sale_listing: parseFloat(saleFee)
  }
}

export function calculateListingFee(propertyType: string): number {
  const fees = getListingFees()
  
  if (propertyType === 'house_rent') {
    return fees.rent_listing
  } else {
    return fees.sale_listing
  }
}

export function createPaymentRecord(
  propertyId: string,
  userId: string,
  propertyType: string
): PaymentInfo {
  const amount = calculateListingFee(propertyType)
  const paymentType = propertyType === 'house_rent' ? 'rent_listing' : 'sale_listing'
  const paymentId = 'payment-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9)
  
  const bankAccount = (settingsOperations.get.get('bank_account_placeholder') as any)?.value || 'BANK_ACCOUNT_PLACEHOLDER'
  
  paymentOperations.create.run(
    paymentId,
    propertyId,
    userId,
    amount,
    paymentType
  )

  return {
    id: paymentId,
    propertyId,
    userId,
    amount,
    paymentType,
    status: 'pending',
    bankAccountPlaceholder: bankAccount,
    whatsappContactPlaceholder: (settingsOperations.get.get('whatsapp_contact_placeholder') as any)?.value || 'WHATSAPP_CONTACT_PLACEHOLDER'
  }
}

export function confirmPayment(paymentId: string, adminId: string, adminNotes?: string, ipAddress?: string): boolean {
  try {
    // Update payment status
    paymentOperations.updateStatus.run('confirmed', adminNotes || '', 'confirmed', paymentId)
    
    // Get payment details
    const payment = paymentOperations.findById.get(paymentId) as any
    if (payment) {
      // Update property status to approved
      propertyOperations.updateStatus.run('approved', payment.property_id)
      
      // Log admin action
      try {
        const { logAdminAction, AdminActions } = require('./admin-logger')
        logAdminAction({
          adminId,
          action: AdminActions.PAYMENT_CONFIRMED,
          targetType: 'payment',
          targetId: paymentId,
          details: `Payment confirmed for property ${payment.property_id}. Notes: ${adminNotes || 'None'}`,
          ipAddress
        })
        
        logAdminAction({
          adminId,
          action: AdminActions.PROPERTY_APPROVED,
          targetType: 'property',
          targetId: payment.property_id,
          details: `Property approved after payment confirmation`,
          ipAddress
        })
      } catch (logError) {
        console.error('Failed to log admin action:', logError)
      }
      
      return true
    }
    
    return false
  } catch (error) {
    console.error('Error confirming payment:', error)
    return false
  }
}

export function rejectPayment(paymentId: string, adminId: string, adminNotes?: string, ipAddress?: string): boolean {
  try {
    // Update payment status
    paymentOperations.updateStatus.run('rejected', adminNotes || '', 'rejected', paymentId)
    
    // Get payment details
    const payment = paymentOperations.findById.get(paymentId) as any
    if (payment) {
      // Update property status to rejected
      propertyOperations.updateStatus.run('rejected', payment.property_id)
      
      // Log admin action
      try {
        const { logAdminAction, AdminActions } = require('./admin-logger')
        logAdminAction({
          adminId,
          action: AdminActions.PAYMENT_REJECTED,
          targetType: 'payment',
          targetId: paymentId,
          details: `Payment rejected for property ${payment.property_id}. Reason: ${adminNotes || 'No reason provided'}`,
          ipAddress
        })
        
        logAdminAction({
          adminId,
          action: AdminActions.PROPERTY_REJECTED,
          targetType: 'property',
          targetId: payment.property_id,
          details: `Property rejected due to payment rejection`,
          ipAddress
        })
      } catch (logError) {
        console.error('Failed to log admin action:', logError)
      }
      
      return true
    }
    
    return false
  } catch (error) {
    console.error('Error rejecting payment:', error)
    return false
  }
}

export function getPaymentInstructions(paymentInfo: PaymentInfo) {
  return {
    amount: paymentInfo.amount,
    currency: 'ETB',
    bankAccount: paymentInfo.bankAccountPlaceholder,
    whatsappContact: paymentInfo.whatsappContactPlaceholder,
    instructions: {
      en: [
        `Transfer ${paymentInfo.amount} ETB to bank account: ${paymentInfo.bankAccountPlaceholder}`,
        `Send payment confirmation screenshot to WhatsApp: ${paymentInfo.whatsappContactPlaceholder}`,
        'Include your payment ID in the message',
        'Your listing will be approved within 24 hours after payment verification'
      ],
      am: [
        `${paymentInfo.amount} ብር ወደ ባንክ ሂሳብ ያስተላልፉ: ${paymentInfo.bankAccountPlaceholder}`,
        `የክፍያ ማረጋገጫ ስክሪንሾት ወደ ዋትስአፕ ይላኩ: ${paymentInfo.whatsappContactPlaceholder}`,
        'በመልእክትዎ ውስጥ የክፍያ መታወቂያዎን ያካትቱ',
        'ከክፍያ ማረጋገጫ በኋላ በ24 ሰዓት ውስጥ ዝርዝርዎ ይፀድቃል'
      ]
    }
  }
}