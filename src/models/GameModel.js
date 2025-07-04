import { prisma } from "@/config/db/db";

class GameModel {
  constructor(userId) {
    this.userId = userId;
  }

  // Character Management
  async createCharacter(characterData) {
    const { name, gender, avatarUrl } = characterData;
    
    try {
      // Check if user already has a character
      const existingCharacter = await prisma.character.findUnique({
        where: { userId: this.userId }
      });

      if (existingCharacter) {
        return {
          success: false,
          status: 400,
          error: "Character already exists"
        };
      }

      // Create character
      const character = await prisma.character.create({
        data: {
          userId: this.userId,
          name,
          gender,
          avatarUrl: avatarUrl || null,
          x: 0, // Starting position
          y: 0
        }
      });

      // Create bank account for new character
      await prisma.bankAccount.create({
        data: {
          userId: this.userId,
          balance: 1000.0 // Starting money
        }
      });

      return {
        success: true,
        character,
        message: "Character created successfully"
      };
    } catch (error) {
      console.error("Error creating character:", error);
      return {
        success: false,
        status: 500,
        error: "Failed to create character"
      };
    }
  }

  async getCharacter() {
    try {
      const character = await prisma.character.findUnique({
        where: { userId: this.userId },
        include: {
          user: {
            select: {
              id: true,
              username: true,
              email: true
            }
          }
        }
      });

      if (!character) {
        return {
          success: false,
          status: 404,
          error: "Character not found"
        };
      }

      return {
        success: true,
        character
      };
    } catch (error) {
      console.error("Error fetching character:", error);
      return {
        success: false,
        status: 500,
        error: "Failed to fetch character"
      };
    }
  }

  async updateCharacterPosition(x, y) {
    try {
      const character = await prisma.character.update({
        where: { userId: this.userId },
        data: { x, y }
      });

      return {
        success: true,
        character
      };
    } catch (error) {
      console.error("Error updating character position:", error);
      return {
        success: false,
        status: 500,
        error: "Failed to update position"
      };
    }
  }

  // Banking System
  async getBankAccount() {
    try {
      const bankAccount = await prisma.bankAccount.findUnique({
        where: { userId: this.userId }
      });

      if (!bankAccount) {
        return {
          success: false,
          status: 404,
          error: "Bank account not found"
        };
      }

      return {
        success: true,
        bankAccount
      };
    } catch (error) {
      console.error("Error fetching bank account:", error);
      return {
        success: false,
        status: 500,
        error: "Failed to fetch bank account"
      };
    }
  }

  async updateBalance(amount, operation = 'add') {
    try {
      const bankAccount = await prisma.bankAccount.findUnique({
        where: { userId: this.userId }
      });

      if (!bankAccount) {
        return {
          success: false,
          status: 404,
          error: "Bank account not found"
        };
      }

      const newBalance = operation === 'add' 
        ? bankAccount.balance + amount 
        : bankAccount.balance - amount;

      if (newBalance < 0) {
        return {
          success: false,
          status: 400,
          error: "Insufficient funds"
        };
      }

      const updatedAccount = await prisma.bankAccount.update({
        where: { userId: this.userId },
        data: { balance: newBalance }
      });

      return {
        success: true,
        bankAccount: updatedAccount
      };
    } catch (error) {
      console.error("Error updating balance:", error);
      return {
        success: false,
        status: 500,
        error: "Failed to update balance"
      };
    }
  }

  // Housing System
  async getHouses() {
    try {
      const houses = await prisma.house.findMany({
        include: {
          owner: {
            select: {
              id: true,
              username: true
            }
          }
        }
      });

      return {
        success: true,
        houses
      };
    } catch (error) {
      console.error("Error fetching houses:", error);
      return {
        success: false,
        status: 500,
        error: "Failed to fetch houses"
      };
    }
  }

  async buyHouse(houseId) {
    try {
      const house = await prisma.house.findUnique({
        where: { id: houseId }
      });

      if (!house) {
        return {
          success: false,
          status: 404,
          error: "House not found"
        };
      }

      if (house.status !== 'AVAILABLE') {
        return {
          success: false,
          status: 400,
          error: "House is not available"
        };
      }

      const bankAccount = await prisma.bankAccount.findUnique({
        where: { userId: this.userId }
      });

      if (!bankAccount || bankAccount.balance < house.price) {
        return {
          success: false,
          status: 400,
          error: "Insufficient funds"
        };
      }

      // Use transaction to ensure consistency
      const result = await prisma.$transaction(async (tx) => {
        // Update house ownership
        const updatedHouse = await tx.house.update({
          where: { id: houseId },
          data: {
            status: 'OWNED',
            ownerId: this.userId
          }
        });

        // Deduct money from bank account
        await tx.bankAccount.update({
          where: { userId: this.userId },
          data: {
            balance: bankAccount.balance - house.price
          }
        });

        return updatedHouse;
      });

      return {
        success: true,
        house: result,
        message: "House purchased successfully"
      };
    } catch (error) {
      console.error("Error buying house:", error);
      return {
        success: false,
        status: 500,
        error: "Failed to buy house"
      };
    }
  }

  // Job System
  async getJobs() {
    try {
      const jobs = await prisma.job.findMany({
        where: { userId: this.userId },
        orderBy: { startedAt: 'desc' }
      });

      return {
        success: true,
        jobs
      };
    } catch (error) {
      console.error("Error fetching jobs:", error);
      return {
        success: false,
        status: 500,
        error: "Failed to fetch jobs"
      };
    }
  }

  async startJob(jobType) {
    try {
      // Check if user has any active jobs
      const activeJob = await prisma.job.findFirst({
        where: {
          userId: this.userId,
          isActive: true
        }
      });

      if (activeJob) {
        return {
          success: false,
          status: 400,
          error: "You already have an active job"
        };
      }

      const job = await prisma.job.create({
        data: {
          userId: this.userId,
          type: jobType,
          isActive: true,
          startedAt: new Date()
        }
      });

      return {
        success: true,
        job,
        message: "Job started successfully"
      };
    } catch (error) {
      console.error("Error starting job:", error);
      return {
        success: false,
        status: 500,
        error: "Failed to start job"
      };
    }
  }

  async completeJob(jobId) {
    try {
      const job = await prisma.job.findUnique({
        where: { id: jobId }
      });

      if (!job || job.userId !== this.userId) {
        return {
          success: false,
          status: 404,
          error: "Job not found"
        };
      }

      if (!job.isActive) {
        return {
          success: false,
          status: 400,
          error: "Job is not active"
        };
      }

      // Calculate earnings based on job type and duration
      const jobDuration = new Date() - new Date(job.startedAt);
      const hoursWorked = jobDuration / (1000 * 60 * 60);
      const baseRate = this.getJobRate(job.type);
      const earnings = Math.floor(hoursWorked * baseRate);

      // Use transaction to update job and bank account
      const result = await prisma.$transaction(async (tx) => {
        // Complete job
        const completedJob = await tx.job.update({
          where: { id: jobId },
          data: {
            isActive: false,
            endedAt: new Date(),
            earnings: earnings
          }
        });

        // Add earnings to bank account
        await tx.bankAccount.update({
          where: { userId: this.userId },
          data: {
            balance: {
              increment: earnings
            }
          }
        });

        return completedJob;
      });

      return {
        success: true,
        job: result,
        earnings,
        message: `Job completed! You earned $${earnings}`
      };
    } catch (error) {
      console.error("Error completing job:", error);
      return {
        success: false,
        status: 500,
        error: "Failed to complete job"
      };
    }
  }

  getJobRate(jobType) {
    const rates = {
      'farmer': 10,
      'teacher': 15,
      'doctor': 25,
      'engineer': 30,
      'artist': 12
    };
    return rates[jobType] || 10;
  }

  // Inventory System
  async getInventory() {
    try {
      const inventory = await prisma.inventoryItem.findMany({
        where: { userId: this.userId },
        orderBy: { itemName: 'asc' }
      });

      return {
        success: true,
        inventory
      };
    } catch (error) {
      console.error("Error fetching inventory:", error);
      return {
        success: false,
        status: 500,
        error: "Failed to fetch inventory"
      };
    }
  }

  async addItem(itemName, quantity = 1) {
    try {
      const existingItem = await prisma.inventoryItem.findFirst({
        where: {
          userId: this.userId,
          itemName: itemName
        }
      });

      let item;
      if (existingItem) {
        // Update existing item quantity
        item = await prisma.inventoryItem.update({
          where: { id: existingItem.id },
          data: {
            quantity: existingItem.quantity + quantity
          }
        });
      } else {
        // Create new item
        item = await prisma.inventoryItem.create({
          data: {
            userId: this.userId,
            itemName: itemName,
            quantity: quantity
          }
        });
      }

      return {
        success: true,
        item,
        message: `Added ${quantity} ${itemName}(s) to inventory`
      };
    } catch (error) {
      console.error("Error adding item:", error);
      return {
        success: false,
        status: 500,
        error: "Failed to add item"
      };
    }
  }

  async removeItem(itemName, quantity = 1) {
    try {
      const existingItem = await prisma.inventoryItem.findFirst({
        where: {
          userId: this.userId,
          itemName: itemName
        }
      });

      if (!existingItem) {
        return {
          success: false,
          status: 404,
          error: "Item not found in inventory"
        };
      }

      if (existingItem.quantity < quantity) {
        return {
          success: false,
          status: 400,
          error: "Insufficient quantity"
        };
      }

      let item;
      if (existingItem.quantity === quantity) {
        // Remove item entirely
        await prisma.inventoryItem.delete({
          where: { id: existingItem.id }
        });
        item = null;
      } else {
        // Update quantity
        item = await prisma.inventoryItem.update({
          where: { id: existingItem.id },
          data: {
            quantity: existingItem.quantity - quantity
          }
        });
      }

      return {
        success: true,
        item,
        message: `Removed ${quantity} ${itemName}(s) from inventory`
      };
    } catch (error) {
      console.error("Error removing item:", error);
      return {
        success: false,
        status: 500,
        error: "Failed to remove item"
      };
    }
  }

  // Game State Management
  async getGameState() {
    try {
      const [character, bankAccount, houses, jobs, inventory] = await Promise.all([
        this.getCharacter(),
        this.getBankAccount(),
        this.getHouses(),
        this.getJobs(),
        this.getInventory()
      ]);

      return {
        success: true,
        gameState: {
          character: character.character,
          bankAccount: bankAccount.bankAccount,
          houses: houses.houses,
          jobs: jobs.jobs,
          inventory: inventory.inventory
        }
      };
    } catch (error) {
      console.error("Error fetching game state:", error);
      return {
        success: false,
        status: 500,
        error: "Failed to fetch game state"
      };
    }
  }
}

export default GameModel;
