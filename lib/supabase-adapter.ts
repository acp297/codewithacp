import { Adapter, AdapterUser, AdapterSession, AdapterAccount } from 'next-auth/adapters'
import { supabaseAdmin } from './supabase'

export function SupabaseAdapter(): Adapter {
  return {
    async createUser(user) {
      const { data, error } = await supabaseAdmin
        .from('User')
        .insert({
          name: user.name,
          email: user.email,
          image: user.image,
        })
        .select()
        .single()

      if (error) throw error
      return data as AdapterUser
    },

    async getUser(id) {
      const { data, error } = await supabaseAdmin
        .from('User')
        .select()
        .eq('id', id)
        .single()

      if (error) return null
      return data as AdapterUser
    },

    async getUserByEmail(email) {
      const { data, error } = await supabaseAdmin
        .from('User')
        .select()
        .eq('email', email)
        .single()

      if (error) return null
      return data as AdapterUser
    },

    async getUserByAccount({ provider, providerAccountId }) {
      const { data, error } = await supabaseAdmin
        .from('Account')
        .select(`
          *,
          user:User(*)
        `)
        .eq('provider', provider)
        .eq('providerAccountId', providerAccountId)
        .single()

      if (error) return null
      return data.user as AdapterUser
    },

    async updateUser(user) {
      const { data, error } = await supabaseAdmin
        .from('User')
        .update({
          name: user.name,
          email: user.email,
          image: user.image,
        })
        .eq('id', user.id)
        .select()
        .single()

      if (error) throw error
      return data as AdapterUser
    },

    async deleteUser(userId) {
      const { error } = await supabaseAdmin
        .from('User')
        .delete()
        .eq('id', userId)

      if (error) throw error
    },

    async linkAccount(account) {
      const { error } = await supabaseAdmin
        .from('Account')
        .insert({
          userId: account.userId,
          type: account.type,
          provider: account.provider,
          providerAccountId: account.providerAccountId,
          refresh_token: account.refresh_token,
          access_token: account.access_token,
          expires_at: account.expires_at,
          token_type: account.token_type,
          scope: account.scope,
          id_token: account.id_token,
          session_state: account.session_state,
        })

      if (error) throw error
    },

    async unlinkAccount({ provider, providerAccountId }) {
      const { error } = await supabaseAdmin
        .from('Account')
        .delete()
        .eq('provider', provider)
        .eq('providerAccountId', providerAccountId)

      if (error) throw error
    },

    async createSession(session) {
      const { data, error } = await supabaseAdmin
        .from('Session')
        .insert({
          sessionToken: session.sessionToken,
          userId: session.userId,
          expires: session.expires,
        })
        .select()
        .single()

      if (error) throw error
      return data as AdapterSession
    },

    async getSessionAndUser(sessionToken) {
      const { data, error } = await supabaseAdmin
        .from('Session')
        .select(`
          *,
          user:User(*)
        `)
        .eq('sessionToken', sessionToken)
        .single()

      if (error) return { session: null, user: null }
      return {
        session: data as AdapterSession,
        user: data.user as AdapterUser,
      }
    },

    async updateSession(session) {
      const { data, error } = await supabaseAdmin
        .from('Session')
        .update({
          expires: session.expires,
        })
        .eq('sessionToken', session.sessionToken)
        .select()
        .single()

      if (error) throw error
      return data as AdapterSession
    },

    async deleteSession(sessionToken) {
      const { error } = await supabaseAdmin
        .from('Session')
        .delete()
        .eq('sessionToken', sessionToken)

      if (error) throw error
    },

    async createVerificationToken(verificationToken) {
      const { error } = await supabaseAdmin
        .from('VerificationToken')
        .insert({
          identifier: verificationToken.identifier,
          token: verificationToken.token,
          expires: verificationToken.expires,
        })

      if (error) throw error
    },

    async useVerificationToken({ identifier, token }) {
      const { data, error } = await supabaseAdmin
        .from('VerificationToken')
        .delete()
        .eq('identifier', identifier)
        .eq('token', token)
        .select()
        .single()

      if (error) return null
      return data
    },
  }
}
