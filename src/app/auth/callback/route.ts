import { NextResponse } from 'next/server'
import { createClient } from '@/utils/supabase/server'

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  
  if (code) {
    const supabase = await createClient()
    const { data: authData, error } = await supabase.auth.exchangeCodeForSession(code)
    
    if (!error && authData.user) {
      // Check if user exists in companies table
      const { data: company, error: fetchError } = await supabase
        .from('companies')
        .select('id')
        .eq('id', authData.user.id)
        .single()
        
      // If company doesn't exist, create it with Google details
      if (!company) {
        const companyName = authData.user.user_metadata?.full_name || "Nueva Empresa"
        await supabase.from('companies').insert({
          id: authData.user.id,
          name: companyName,
          whatsapp_phone_number_id: "",
          whatsapp_access_token: "",
          mercadopago_access_token: null
        })
      }
      
      return NextResponse.redirect(`${origin}/`)
    }
  }

  // return the user to an error page with instructions
  return NextResponse.redirect(`${origin}/login?message=Error de autenticación con Google`)
}
