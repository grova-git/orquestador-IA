'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/utils/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { error } = await supabase.auth.signInWithPassword(data)

  if (error) {
    redirect('/login?message=No se pudo iniciar sesión. Verifica tus credenciales.')
  }

  revalidatePath('/', 'layout')
  redirect('/')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()
  const data = {
    email: formData.get('email') as string,
    password: formData.get('password') as string,
  }

  const { data: authData, error } = await supabase.auth.signUp(data)

  if (error) {
    redirect('/login?message=Error al crear la cuenta.')
  }

  // Si se crea el usuario, crear la empresa en nuestra base de datos (dummy name por ahora)
  if (authData.user) {
     const { error: dbError } = await supabase.from('companies').insert({
       id: authData.user.id,
       name: "Mi Nueva Empresa",
       whatsapp_phone_number_id: "PONER_AQUI",
       whatsapp_access_token: "PONER_AQUI",
       mercadopago_access_token: null
     })
     if (dbError) {
         console.error("Error creating company row:", dbError)
     }
  }

  revalidatePath('/', 'layout')
  redirect('/')
}
