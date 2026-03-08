const {By, until } = require('selenium-webdriver');
const { createDriver } = require('./config');

describe('Profile Update & Password Change Flow', () => {
  let driver;
  
  const uniqueId = Date.now();
  const initialUsername = `user_${uniqueId}`;
  const updatedUsername = `updated_${uniqueId}`;
  const initialEmail = `user${uniqueId}@teste.com`;
  const updatedEmail = `updated${uniqueId}@teste.com`;
  
  const currentPassword = 'SenhaForte@123';
  const newPassword = 'NovaSenhaForte@321';

  beforeAll(async () => {
    driver = await createDriver();
    await driver.manage().window().maximize();
  });

  afterAll(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  it('1. Should register and login automatically', async () => {
    await driver.get('http://localhost:5173/register'); 
    await driver.findElement(By.css('[data-testid="register-username-input"]')).sendKeys(initialUsername);
    await driver.findElement(By.css('[data-testid="register-email-input"]')).sendKeys(initialEmail);
    await driver.findElement(By.css('[data-testid="register-password-input"]')).sendKeys(currentPassword);
    await driver.findElement(By.css('[data-testid="register-submit-button"]')).click();

    await driver.wait(until.urlContains('/login'), 5000);

    const userInput = await driver.wait(until.elementLocated(By.css('[data-testid="login-username-input"]')), 5000);
    await userInput.sendKeys(initialUsername);
    await driver.findElement(By.css('[data-testid="login-password-input"]')).sendKeys(currentPassword);
    await driver.findElement(By.css('[data-testid="login-submit-button"]')).click();

    await driver.wait(until.urlContains('/dashboard'), 10000);
  });

  it('2. Should update profile data (Username and Email)', async () => {
    await driver.findElement(By.css('[data-testid="navbar-profile-link"]')).click();
    
    const usernameInput = await driver.wait(until.elementLocated(By.css('[data-testid="profile-username-input"]')), 5000);
    
    await usernameInput.clear();
    await usernameInput.sendKeys(updatedUsername);

    const emailInput = await driver.findElement(By.css('[data-testid="profile-email-input"]'));
    await emailInput.clear();
    await emailInput.sendKeys(updatedEmail);

    const saveProfileBtn = await driver.findElement(By.css('[data-testid="profile-save-button"]'));
    await saveProfileBtn.click();

    await driver.sleep(1500); 

    const newInputValue = await usernameInput.getAttribute('value');
    expect(newInputValue).toBe(updatedUsername);
  });

  it('3. Should update the password', async () => {
    const currentPassInput = await driver.findElement(By.css('[data-testid="password-change-current-input"]'));
    await currentPassInput.sendKeys(currentPassword);

    const newPassInput = await driver.findElement(By.css('[data-testid="password-change-new-input"]'));
    await newPassInput.sendKeys(newPassword);

    const confirmPassInput = await driver.findElement(By.css('[data-testid="password-change-confirm-input"]'));
    await confirmPassInput.sendKeys(newPassword);

    const changePassBtn = await driver.findElement(By.css('[data-testid="password-change-update-button"]'));
    await changePassBtn.click();

    await driver.sleep(1500);
  });

  it('4. Should DELETE the account to clean up', async () => {
    const deleteBtn = await driver.wait(
      until.elementLocated(By.css('[data-testid="profile-delete-account-button"]')), 
      5000
    );
    
    await driver.executeScript("arguments[0].scrollIntoView(true);", deleteBtn);
    await driver.sleep(500); 
    
    await deleteBtn.click();

    await driver.wait(until.alertIsPresent(), 5000);
    const alert = await driver.switchTo().alert();
    await alert.accept(); 

    await driver.wait(until.urlContains('/login'), 10000);
  });
});