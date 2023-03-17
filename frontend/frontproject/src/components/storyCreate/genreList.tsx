import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useRecoilValue, useRecoilState } from 'recoil'
import {
  ImageBit,
  genreAtom,
  loadingAtom,
  storyEn,
  storyKo,
  voiceAtom,
} from '../../atoms'
import { createStory, createVoice, translateStory } from '../../api/storyApi'
import Loading from './loading'
import styles from '../../assets/css/genreList.module.css'

export default function ImageUpload() {
  const [genre, setGenre] = useRecoilState(genreAtom)
  const [loading, setLoading] = useRecoilState(loadingAtom)
  const [text, setText] = useState('') // 이미지 켑셔닝 결과
  const [storyKorean, setStoryKorean] = useRecoilState(storyKo)
  const [storyEnglish, setStoryEnglish] = useRecoilState(storyEn)
  const [voice, setVoice] = useRecoilState(voiceAtom)

  const navigate = useNavigate()

  const clickGenre = (e: any) => {
    e.target.classList.add('active')
    setGenre(e.target.value)
  }
  const next = () => {}

  const items = ['재미', '슬픔', '공포', '로맨스']

  const Image = useRecoilValue(ImageBit)
  const Image2 = Image.substring(23)

  const ImageCaptioning = async () => {
    runClip()
  }

  const runClip = async () => {
    setLoading(true)
    const raw = JSON.stringify({
      user_app_id: {
        user_id: 'clarifai',
        app_id: 'main',
      },
      inputs: [
        {
          data: {
            image: {
              base64: Image2,
            },
          },
        },
      ],
    })

    const info = {
      detailImageFile: Object,
      detailImageUrl: String,
    }

    const requestOptions = {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        Authorization: 'Key ' + '65a4f037b024440db6d5786d9c868030',
      },
      body: raw,
    }

    fetch(
      `https://api.clarifai.com/v2/models/general-english-image-caption-clip/versions/2489aad78abf4b39a128fbbc64a8830c/outputs`,
      requestOptions,
    )
      .then((response) => response.json())
      .then((result) => {
        sendContent(result.outputs[0].data.text.raw, genre)
      })
      .catch((error) => console.log('error', error))
  }

  const sendContent = async (text: string, genre: string) => {
    setText(text)
    const response = await createStory(text, genre)
    const result = response.data.content
    setStoryEnglish(result)
    if (response.status === 200) {
      console.log(response.data)
      setLoading(false)
      navigate('/storyResult')
      makeVoice(response.data)
      translate(result)
    }
  }

  const makeVoice = async (content: string) => {
    const response = await createVoice(content, genre)
    const data1 = response.data
    const data2 = URL.createObjectURL(data1)

    console.log(response.data)
    setVoice(data2)
  }

  const translate = async (storyEng: string) => {
    const response = await translateStory(storyEng)
    setStoryKorean(response.data)
    console.log('storyEng:', response.data)
    console.log('StoryKorean:', storyKorean)
  }

  const trans = async () => {
    const response = await createVoice('hihihi', 'nima')
  }

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <div>
          <audio src={voice} loop></audio>
          <div className={styles.container}>
            {items.map((item, idx) => {
              let id = 'genreBtn-' + (idx + 1)
              return (
                <>
                  <input
                    id={styles[`${id}`]}
                    type="radio"
                    name="gerne"
                    value={items[idx]}
                    onChange={clickGenre}
                  ></input>

                  <label
                    className={
                      items[idx] == genre
                        ? `${styles.genre_label_active}`
                        : `${styles.genre_label}`
                    }
                    htmlFor={styles[`${id}`]}
                  >
                    {items[idx]}
                  </label>
                </>
              )
            })}
          </div>
          <button className={styles.createBtn} onClick={ImageCaptioning}>
            이야기 만들기
          </button>
          <button onClick={trans}>test</button>
        </div>
      )}
    </>
  )
}
