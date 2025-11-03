import jwt from "jsonwebtoken"

const tokenUser = async (idd) => {
  try {
    const tokenn = jwt.sign({ id: idd }, process.env.SecretKey);
    console.log(tokenn, "TOkenIsCreated");

    const verifyy = jwt.verify(tokenn, process.env.SecretKey);
    console.log(verifyy, "Verrifyy");

    return { tokenn, verifyy };
  } catch (error) {
    console.log(error, "errorinTOken");
  }
};
export default tokenUser;