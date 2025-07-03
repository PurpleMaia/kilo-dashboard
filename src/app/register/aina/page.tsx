import { db } from "../../../../db/kysely/client";
import RegistrationStep2 from "../components/RegistrationStep2";

export default async function AinaRegistration() {
  const ainaList = await db.selectFrom('aina').select(['id', 'name']).execute();

  return (
    <>
      <RegistrationStep2 ainaList={ainaList}/>
    </>
  )


}