const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

// Captura a configuração padrão do Expo
const config = getDefaultConfig(__dirname);

// Envolve a configuração com o NativeWind, apontando exatamente para o seu arquivo CSS global
module.exports = withNativeWind(config, { input: "./styles/global.css" });