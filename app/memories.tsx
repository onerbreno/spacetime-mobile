import { View, TouchableOpacity, ScrollView, Text, Image } from 'react-native'
import NLWLogo from '../src/assets/nlw-spacetime-logo.svg'
import { Link, useRouter } from 'expo-router'
import Icon from '@expo/vector-icons/Feather'
import * as SecureStore from 'expo-secure-store'

import { useSafeAreaInsets } from 'react-native-safe-area-context'
import React, { useEffect, useState } from 'react'
import dayjs from 'dayjs'
import ptBr from 'dayjs/locale/pt-br'
import { api } from '../src/lib/api'

dayjs.locale(ptBr)

interface Memory {
  coverUrl: string
  excerpt: string
  id: string
  createdAt: string
}

export default function Memories() {
  const { bottom, top } = useSafeAreaInsets()
  const router = useRouter()
  const [memories, setMemories] = useState<Memory[]>([])

  async function signOut() {
    await SecureStore.deleteItemAsync('token')
    router.push('/')
  }

  async function loadMemories() {
    const token = await SecureStore.getItemAsync('token')

    const response = await api.get('/memories', {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    setMemories(response.data)
  }

  useEffect(() => {
    loadMemories()
  }, [])

  return (
    <ScrollView
      className="flex-1"
      contentContainerStyle={{ paddingBottom: bottom, paddingTop: top }}
    >
      <View className="mt-4 flex-row items-center justify-between px-8">
        <NLWLogo />

        <View className="flex-row gap-2">
          <TouchableOpacity
            onPress={signOut}
            className="h-10 w-10 items-center justify-center rounded-full bg-red-500"
          >
            <Icon name="log-out" className="size={16}" color="#000" />
          </TouchableOpacity>
          <Link href="/new" asChild>
            <TouchableOpacity className="h-10 w-10 items-center justify-center rounded-full bg-green-500">
              <Icon name="plus" className="size={16}" color="#000" />
            </TouchableOpacity>
          </Link>
        </View>
      </View>

      <View className="mt-6 space-y-10">
        {memories.map((memory) => (
          <View key={memory.id} className="space-y-4">
            <View className="flex-row items-center gap-2">
              <View className="h-px w-5 bg-gray-50" />
              <Text className="font-body text-xs leading-relaxed text-gray-100">
                {dayjs(memory.createdAt).format('D[ de ]MMMM[, ]YYYY')}
              </Text>
            </View>
            <View className="space-y-4 px-8">
              <Image
                source={{
                  uri: memory.coverUrl,
                }}
                className="aspect-video w-full rounded-lg"
                alt=""
              />
              <Text className="font-body text-base leading-relaxed text-gray-100">
                {memory.excerpt}
              </Text>
              <Link href="memories/id" asChild>
                <TouchableOpacity className="flex-row items-center gap-2">
                  <Text className="font-body text-sm leading-relaxed text-gray-200">
                    Ler mais
                  </Text>
                  <Icon name="arrow-right" size={16} color="#9e9ea0"></Icon>
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        ))}
      </View>
    </ScrollView>
  )
}