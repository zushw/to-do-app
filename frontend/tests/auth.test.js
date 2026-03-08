const { Builder, By, until } = require('selenium-webdriver');

describe('Authentication & Profile Flow', () => {
  let driver;
  
  const uniqueUsername = `user_${Date.now()}`;
  const uniqueEmail = `${uniqueUsername}@teste.com`;
  const strongPassword = 'SenhaForte@123';

  beforeAll(async () => {
    driver = await new Builder().forBrowser('chrome').build();
    await driver.manage().window().maximize();
  });

  afterAll(async () => {
    if (driver) {
      await driver.quit();
    }
  });

  it('1. Should show error message on invalid credentials', async () => {
    await driver.get('http://localhost:5173/login');

    await driver.findElement(By.css('[data-testid="login-username-input"]')).sendKeys('usuario_inexistente_123');
    await driver.findElement(By.css('[data-testid="login-password-input"]')).sendKeys('senha_errada');
    await driver.findElement(By.css('[data-testid="login-submit-button"]')).click();

    const errorMessage = await driver.wait(
      until.elementLocated(By.className('text-red-700')),
      5000
    );

    const text = await errorMessage.getText();
    expect(text).toBeTruthy();
  });

  it('2. Should register a new user successfully', async () => {
    await driver.get('http://localhost:5173/register'); 

    await driver.findElement(By.css('[data-testid="register-username-input"]')).sendKeys(uniqueUsername);
    await driver.findElement(By.css('[data-testid="register-email-input"]')).sendKeys(uniqueEmail);
    await driver.findElement(By.css('[data-testid="register-password-input"]')).sendKeys(strongPassword);
    await driver.findElement(By.css('[data-testid="register-submit-button"]')).click();

    await driver.findElement(By.css('[data-testid="register-submit-button"]')).click();

    await driver.wait(until.urlContains('/login'), 5000);
  });

  it('3. Should login with the newly created user', async () => {
    const userInput = await driver.wait(until.elementLocated(By.css('[data-testid="login-username-input"]')), 5000);
    await userInput.clear();
    await userInput.sendKeys(uniqueUsername);
    
    const passInput = await driver.findElement(By.css('[data-testid="login-password-input"]'));
    await passInput.clear();
    await passInput.sendKeys(strongPassword);
    
    await driver.findElement(By.css('[data-testid="login-submit-button"]')).click();

    await driver.wait(until.urlContains('/dashboard'), 10000);
  });

  it('4. Should go to profile and check disabled save button', async () => {
    await driver.findElement(By.css('[data-testid="navbar-profile-link"]')).click();
    
    const profileTitle = await driver.wait(
      until.elementLocated(By.xpath("//h2[contains(text(), 'Account Settings')]")),
      5000
    );
    expect(await profileTitle.isDisplayed()).toBe(true);

    const saveButton = await driver.findElement(By.css('[data-testid="profile-save-button"]'));
    const isDisabled = await saveButton.getAttribute('disabled');
    
    expect(isDisabled).toBeTruthy(); 
  });

  it('5. Should DELETE the account to clean up the database', async () => {
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