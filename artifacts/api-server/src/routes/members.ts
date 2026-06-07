import { Router } from "express";
import { db } from "@workspace/db";
import { membersTable, memberCategoriesTable, insertMemberSchema } from "@workspace/db";
import { eq, and } from "drizzle-orm";

const router = Router();

router.get("/members/categories", async (req, res) => {
  try {
    const categories = await db.select().from(memberCategoriesTable);
    res.json(categories);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch categories" });
  }
});

router.get("/members", async (req, res) => {
  try {
    const { category, county, limit = "20", offset = "0" } = req.query as Record<string, string>;

    let query = db.select().from(membersTable);
    const conditions = [];
    if (category) conditions.push(eq(membersTable.category, category));
    if (county) conditions.push(eq(membersTable.county, county));

    const results = await db
      .select()
      .from(membersTable)
      .where(conditions.length ? and(...conditions) : undefined)
      .limit(parseInt(limit))
      .offset(parseInt(offset));

    res.json(results);
  } catch (err) {
    req.log.error(err);
    res.status(500).json({ error: "Failed to fetch members" });
  }
});

router.post("/members", async (req, res) => {
  try {
    const parsed = insertMemberSchema.safeParse(req.body);
    if (!parsed.success) {
      res.status(400).json({ error: parsed.error.issues });
      return;
    }

    const membershipNumber = `KSME-${Date.now()}-${Math.floor(Math.random() * 1000)}`;

    const [member] = await db
      .insert(membersTable)
      .values({ ...parsed.data, membershipNumber, status: "pending" })
      .returning();

    res.status(201).json(member);
  } catch (err: any) {
    req.log.error(err);
    if (err.code === "23505") {
      res.status(400).json({ error: "Email already registered" });
      return;
    }
    res.status(500).json({ error: "Failed to register member" });
  }
});

export default router;
