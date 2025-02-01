import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Missing Supabase environment variables')
}

export async function signInWithWallet(walletAddress: string) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: `${walletAddress}@wallet.com`,
      password: 'dummy-wallet-password'
    })

    if (error) {
      if (error.message.includes('Invalid login credentials')) {
        const { data: signUpData, error: signUpError } = await supabase.auth.signUp({
          email: `${walletAddress}@wallet.com`, // not using athena.com it might conflict with the wallet address
          password: walletAddress,
          options: {
            data: {
              wallet_address: walletAddress
            }
          }
        })

        if (signUpError) {
          throw signUpError
        }

        return { data: signUpData, error: null }
      }
      throw error
    }

    return { data, error: null }
  } catch (error) {
    return { data: null, error }
  }
}

export const signOut = async () => {
  const { error } = await supabase.auth.signOut()
  if (error) {
    throw error
  }
}

export const supabase = createClient(supabaseUrl, supabaseKey)
