# api_for_Lanisters

FCS Syntax keywords
{FEE-ID} Each fee configuration has an 8-Character (Alphanumeric) Identifier.
{FEE-CURRENCY} - Currency the fee configuration is applicable to. (Will be NGN for this assessment)
{FEE-LOCALE} Locale the fee configuration is applicable in. Locales are determined by two main attributes of a transaction, the currency and the country of the entity used for payment. The rule is, if the currency's country and the country of the payment entity are the same, the transaction is processed as a local one (LOCL) e.g. an NGN 5000 transaction with an NG-Issued GTBANK Mastercard is local. If the currency's country and the country of the payment entity are not the same, the transaction is processed as an international one (INTL) e.g. an NGN 5000 transaction with a US-Issued AMEX card is international.
{FEE-ENTITY} The entity to be charged for the transaction. This could be a credit / debit card, a USSD mobile number, a Nigerian Bank account OR a Wallet ID. The supported values are: CREDIT-CARD, DEBIT-CARD, BANK-ACCOUNT, USSD, WALLET-ID
{ENTITY-PROPERTY} This is used, primarily, to define specificity. It refers to any of the valid payment entity properties. A value of _ means it applies to all. Examples:
LNPY1222 NGN INTL CREDIT-CARD(MASTERCARD) : APPLY PERC 3.8 means this fee specification is applicable only to MASTERCARD CREDIT CARDS
LNPY1221 NGN LOCL CREDIT-CARD(_) : APPLY PERC 1.4 means this fee specification is applicable to all CREDIT CARDS
LNPY1224 NGN LOCL USSD(MTN) : APPLY FLAT_PERC 20:0.5 means this fee specification is only applicable to USSD transactions where the mobile number used is from the MTN telco provider.
{FEE-TYPE} The type of the fee defines how it is applied. Possible values for the FEE-TYPE are:
FLAT A fee of type flat is applied as is. E.g. FLAT 50 means 50 NGN is applied directly as the transaction fee.
PERC A fee of type percentage is applied differently. The value is multiplied by the transaction amount and divided by 100 to get the applicable fee value. E.g. PERC 1.4 means 1.4% of the transaction amount is applied as the transaction fee.
FLAT_PERC A fee of type flat and percentage indicates that the fee entry has both FLAT and percentage values. E.g. FLAT_PERC 20:0.5 means a flat fee of 20 NGN and 0.5% of the transaction amount is applied as the transaction fee.
{FEE-VALUE} The value of the fee to be applied. It's usually a non-negative numeric (0 inclusive) value with the exception of cases where {FEE-TYPE} is FLAT_PERC, then it's a string in the form {FLAT-VALUE}:{PERC-VALUE} e.g. FLAT_PERC 20:0.5. Examples:
FLAT 50 means 50 NGN is applied directly as the transaction fee
PERC 1.4 means 1.4% of the transaction amount is applied as the transaction fee.
FLAT_PERC 20:0.5 means a flat fee of 20 NGN and 0.5% of the transaction amount is applied as the transaction fee
Some additional information from LannisterPay
The {FEE-CURRENCY} {FEE-LOCALE} {FEE-ENTITY} can also have their values set as _. An example, LNPY1224 _ _ CREDIT-CARD(_) : APPLY FLAT_PERC 20:0.5 means the fee should be applied to all CREDIT-CARD transactions in any currency and locale.
Only one fee configuration entry is applicable to a transaction at any time. Your service is to decide the most apt configuration to apply based on its precedence.
The higher the specificity of a fee configuration entry, the higher its precedence. E.g. LNPY1229 NGN INTL CREDIT-CARD(MASTERCARD) : APPLY PERC 3.8 has a higher precedence than LNPY1221 NGN INTL CREDIT-CARD(_) : APPLY PERC 5.8. If a MASTERCARD CREDIT-CARD transaction is presented to your service, the first configuration should be applied even though both of them are valid CREDIT CARD configurations. This is because it's more specific (in "specifying" that it's applicable to only "Mastercard" transactions). In the same vein, LNPY1221 NGN INTL CREDIT-CARD(_) : APPLY PERC 5.8 has a higher precedence than LNPY1222 NGN INTL _(_) : APPLY PERC 5.8 because it's more specific (in "specifying" that it's applicable to credit card transactions). Configuration entries with more specific details (be it the ENTITY TYPE / PROPERTY OR LOCALE) should be considered first while configurations having a lot of \* values should be considered last.
