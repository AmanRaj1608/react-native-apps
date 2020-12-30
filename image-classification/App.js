import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, Button, Image, TouchableOpacity } from 'react-native'
import * as tf from '@tensorflow/tfjs'
import * as mobilenet from '@tensorflow-models/mobilenet'
import { fetch } from '@tensorflow/tfjs-react-native'
import * as jpeg from 'jpeg-js'
import * as ImagePicker from 'expo-image-picker'
import * as FileSystem from 'expo-file-system';
// import SvgLoader from './components/SvgLoader';


function App() {

  const [isTfReady, setIsTfReady] = useState(false);
  const [isModelReady, setIsModelReady] = useState(false);
  const [image, setImage] = useState(null);
  const [model, setModel] = useState(null);
  const [predictions, setPredictions] = useState([]);
  const [loading, setLoading] = useState('Load image to process')

  useEffect(() => {
    (async () => {
      try {
        await tf.ready();
        setIsTfReady(true);
        const mdl = await mobilenet.load();
        setModel(mdl);
        // console.log(a)
        setIsModelReady(true);
        //Output in Expo console
        console.log(isModelReady);
        console.log(isTfReady)
      } catch (err) {
        console.log(err);
      }
    })();
  }, [])

  const imageToTensor = (rawImageData) => {
    const TO_UINT8ARRAY = true
    const { width, height, data } = jpeg.decode(rawImageData, TO_UINT8ARRAY)
    // Drop the alpha channel info for mobilenet
    const buffer = new Uint8Array(width * height * 3)
    let offset = 0
    for (let i = 0; i < buffer.length; i += 3) {
      buffer[i] = data[offset]
      buffer[i + 1] = data[offset + 1]
      buffer[i + 2] = data[offset + 2]
      offset += 4
    }
    return tf.tensor3d(buffer, [height, width, 3])
  }

  const classifyImage = async () => {
    try {
      // const imageAssetPath = Image.resolveAssetSource(image)
      // console.log(imageAssetPath)
      // const res = await fetch(imageAssetPath.uri, {}, { isBinary: true })
      // const rawImageData = await res.arrayBuffer()
      // const imageTensor = await imageToTensor(rawImageData)

      console.log("about to start read image")
      const fileUri = image.uri;
      const imgB64 = await FileSystem.readAsStringAsync(fileUri, {
        encoding: FileSystem.EncodingType.Base64,
      });
      console.log("read done encoding now");
      const imgBuffer = tf.util.encodeString(imgB64, 'base64').buffer;
      const raw = new Uint8Array(imgBuffer)
      const imageTensor = await imageToTensor(raw);
      const pred = await model.classify(imageTensor)
      setPredictions(pred);
      console.log(pred);
    } catch (err) {
      console.log(err)
    }
  }

  const selectImage = async () => {
    try {
      let res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.All,
        allowsEditing: true,
        aspect: [4, 3]
      })
      if (!res.cancelled) {
        const source = { uri: res.uri }
        setImage(source);
        setLoading('Wait for processing...');
        console.log("print source", source);
        console.log("print image", image);
        console.log(source, image);
        await classifyImage();
        setLoading(`Predictions: ${predictions[0].className}, ${predictions[1].className}, ${predictions[2].className}`);
      }
    } catch (err) {
      console.log(err)
    }
  }

  const captureImage = async () => {
    try {
      let res = await ImagePicker.launchCameraAsync();
      if (!res.cancelled) {
        // console.log(res);
        const source = { uri: res.uri }
        setImage(source);
        setLoading('Wait for processing...');
        console.log("print source", source);
        console.log("print image", image);
        console.log(source, image);
        await classifyImage();
        setLoading(`Predictions: ${predictions[0].className}, ${predictions[1].className}, ${predictions[2].className}`);
      }
    } catch (err) {

    }
  }

  return (
    <View style={styles.container}>
      {
        !isModelReady ? <Text style={styles.loading}>Loading Model...</Text>
          : <>
            <Text style={styles.title}>
              Image Classifier
            </Text>

            <TouchableOpacity style={styles.imageWrapper}>
              {image && <Image source={image} style={styles.imageContainer} />}
              {isModelReady && !image && (
                <Text style={styles.transparentText}>Img here</Text>
              )}
            </TouchableOpacity>

            <Text style={styles.prediction}>{loading}</Text>

            <View style={styles.button}>
              <View style={styles.buttontext}>
                <Button color="#81b29a" title="Capture" onPress={captureImage} />
              </View>
              <View style={styles.buttontext}>
                <Button color="#81b29a" title="Upload" onPress={selectImage} />
              </View>
            </View>
          </>
      }
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#3d405b',
    color: '#f6f5f5',
    alignItems: 'center',
    justifyContent: 'center'
  },
  title: {
    margin: 0,
    color: "#f4f1de",
    fontSize: 35,
  },
  loading: {
    margin: 20,
    color: "#f6f5f5",
    fontSize: 20,
  },
  prediction: {
    margin: 10,
    marginLeft: 40,
    marginRight: 40,
    color: "#f4f1de",
    fontSize: 16,
  },
  button: {
    flexDirection: 'row',
    padding: 10,
    borderRadius: 50,
  },
  buttontext: {
    marginHorizontal: 10
  },
  capture: {
    height: 100,
    width: 100,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
  },
  imageWrapper: {
    width: 280,
    height: 280,
    padding: 10,
    borderColor: '#ee6c4d',
    borderWidth: 5,
    borderStyle: 'dashed',
    marginTop: 40,
    marginBottom: 10,
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center'
  },
  imageContainer: {
    width: 250,
    height: 250,
    position: 'absolute',
    top: 10,
    left: 10,
    bottom: 10,
    right: 10
  },
  predictionWrapper: {
    height: 100,
    width: '100%',
    flexDirection: 'column',
    alignItems: 'center'
  },
  transparentText: {
    color: '#ffffff',
    opacity: 0.7
  },
})

export default App;