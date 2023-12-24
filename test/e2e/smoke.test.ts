import { faker } from '@faker-js/faker'
import { expect, test } from 'test/playwright-utils'

test('register and login', async ({ page }) => {
  let newUser = makeUser()

  await page.goto('/')

  await page.getByRole('link', { name: /sign up/i }).click()

  await page.getByRole('textbox', { name: /email/i }).fill(newUser.email)
  await page.getByRole('textbox', { name: /password/i }).fill(newUser.password)
  await page.getByRole('button', { name: /create account/i }).click()

  await page.getByRole('link', { name: /view notes/i }).click()
  await page.getByRole('button', { name: /logout/i }).click()
  await page.getByRole('link', { name: /log in/i }).click()
})

test('create and delete a note', async ({ page }) => {
  let newUser = makeUser()
  let newNote = makeNote()

  await page.goto('/')

  await page.getByRole('link', { name: /sign up/i }).click()

  await page.getByRole('textbox', { name: /email/i }).fill(newUser.email)
  await page.getByRole('textbox', { name: /password/i }).fill(newUser.password)
  await page.getByRole('button', { name: /create account/i }).click()

  await page.getByRole('link', { name: /view notes/i }).click()
  await expect(page.getByText(/no notes yet/i)).toBeVisible()

  await page.getByRole('link', { name: '+ New Note' }).click()

  await page.getByRole('textbox', { name: /title/i }).fill(newNote.title)
  await page.getByRole('textbox', { name: /body/i }).fill(newNote.body)
  await page.getByRole('button', { name: /save/i }).click()

  await page.getByRole('link', { name: newNote.title }).click()

  await page.getByRole('button', { name: /delete/i }).click()
  await expect(
    page.getByRole('link', { name: newNote.title }),
  ).not.toBeVisible()
})

function makeUser() {
  return {
    email: `${faker.internet.userName()}@example.com`,
    password: faker.internet.password(),
  }
}

function makeNote() {
  return {
    title: faker.lorem.words(3),
    body: faker.lorem.paragraphs(3),
  }
}
