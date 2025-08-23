import { Aina } from "@/lib/types";
import { db } from "../../../../db/kysely/client";
import RegistrationStep2 from "../components/RegistrationStep2";

export default async function AinaRegistration() {
  const ainaList: Aina[] = await db.selectFrom('aina').select(['id', 'name', 'created_at as createdAt']).execute();

  return (
    <>
      <RegistrationStep2 ainaList={ainaList}/>
    </>
  )


}