class ConnectionService
{
    static async isConnected()
    {
        try
        {
            return await ApiService.ping();
        }
        catch
        {
            return false;
        }
    }
}