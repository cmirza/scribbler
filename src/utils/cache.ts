export class Cache {
    private data: { [key: string]: string } = {};
  
    public get(key: string): string | undefined {
      return this.data[key];
    }
  
    public set(key: string, value: string): void {
      this.data[key] = value;
    }
  
    public has(key: string): boolean {
      return this.data.hasOwnProperty(key);
    }
  }
  